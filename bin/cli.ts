#!/usr/bin/env ts-node

import chalk from 'chalk';
import { program } from 'commander';
import { generateKeyPairSync, randomBytes } from 'crypto';
import * as dotenv from 'dotenv';
import { readdir, readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

const log = (type: 'error' | 'info' | 'warn', msg: string, ...args: any[]) => {
  const prefix = '[AppCompass CLI] ';
  const timestamp = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).format(new Date());

  const color = type === 'error' ? chalk.red : type === 'warn' ? chalk.yellow : chalk.cyan;
  const message = type === 'info' ? chalk.green(msg) : color(msg);
  console.log(chalk.grey(timestamp), color.bold(prefix), message, ...args);
};

const servicesBasePath = resolve(__dirname, '..', 'services');

function getServiceDotenv(serviceBasePath: string) {
  const { parsed } = dotenv.config({ path: resolve(serviceBasePath, '.env') });
  return parsed;
}

async function generateKeyPair() {
  log('info', 'Key Pair', 'Generating.');
  const passphrase = randomBytes(256 / 8).toString('hex');

  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase
    }
  });
  log('info', 'Key Pair', 'Generated!');
  return { passphrase, publicKey, privateKey };
}

function getDefaultAppConfig(name: string) {
  name;
  return {
    rateLimit: {
      max: 0
    }
  };
}

function getDefaultDbConfig(dbDefaults, overrides: Record<string, string> = {}) {
  return {
    logging: 'all',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    schema: dbDefaults.schema,
    database: process.env.DB_NAME,
    synchronize: false,
    migrationsRun: false,
    ...overrides
  };
}

function getDefaultInterserviceTransportConfig(name: string) {
  return {
    transport: 2,
    options: { servers: ['nats://localhost:4222'], queue: name }
  };
}

function createUrl(name: string, port: string) {
  return `http://127.0.0.1:${port}/${name}`;
}

async function serviceUrls(serviceFolders: string[], exclude: string, nested = false) {
  const services = await Promise.all(
    serviceFolders
      .filter((folderName) => folderName !== exclude)
      .map(async (folderName) => {
        const serviceBasePath = resolve(servicesBasePath, folderName);
        try {
          const serviceDetailsContent = await readFile(`${serviceBasePath}/service-details.json`, { encoding: 'utf8' });
          const details = JSON.parse(serviceDetailsContent);
          const content = await readFile(`${serviceBasePath}/package.json`, { encoding: 'utf8' });
          const obj = JSON.parse(content);

          return { name: obj.name, type: details.type, port: details?.defaults?.SERVICE_PORT };
        } catch (error) {
          log('error', `Error reading ${folderName} service details`, error);
        }
      })
  );
  const filteredServices = services.filter((service) => service.type === 'api');
  return nested
    ? { SERVICES: filteredServices.map(({ name, port }) => ({ name, api_url: createUrl(name, port) })) }
    : filteredServices.reduce((acc, { name, port }) => {
        Object.assign(acc, { [`${name.toUpperCase()}_API_URL`]: createUrl(name, port) });
        return acc;
      }, {});
}

async function buildApiEnvFile(
  serviceFolder: string,
  details,
  serviceBasePath: string,
  passphrase: string,
  publicKey: string,
  privateKey: string,
  serviceFolders: string[]
) {
  const authVars = {
    ...(details.authKeys.includes('PASSPHRASE') ? { PASSPHRASE: passphrase } : {}),
    ...(details.authKeys.includes('PUBLIC_KEY') ? { PUBLIC_KEY: publicKey } : {}),
    ...(details.authKeys.includes('PRIVATE_KEY') ? { PRIVATE_KEY: privateKey } : {})
  };
  const content = await readFile(`${serviceBasePath}/package.json`, { encoding: 'utf8' });
  const obj = JSON.parse(content);

  const servicesUrls = await serviceUrls(serviceFolders, serviceFolder);

  const appConfig = { APP_CONFIG: getDefaultAppConfig(obj.name) };

  const dbConfig = details.db ? { DB_CONFIG: getDefaultDbConfig(details.db) } : { undefined };

  const interserviceTransportConfig = getDefaultInterserviceTransportConfig(obj.name);
  await writeObjectToEnvFile(
    {
      SERVICE_NAME: obj.name,
      ...details.defaults,
      ...authVars,
      ...appConfig,
      ...dbConfig,
      INTERSERVICE_TRANSPORT_CONFIG: interserviceTransportConfig,
      ...servicesUrls
    },
    serviceBasePath
  );
}

async function buildUiEnvFile(serviceFolder: string, details, serviceBasePath: string, serviceFolders: string[]) {
  const content = await readFile(`${serviceBasePath}/package.json`, { encoding: 'utf8' });
  const obj = JSON.parse(content);

  const servicesUrls = await serviceUrls(serviceFolders, serviceFolder, true);

  await writeObjectToEnvFile(
    {
      SERVICE_NAME: obj.name,
      ...details.defaults,
      ...servicesUrls
    },
    serviceBasePath,
    'public/config.json',
    'json'
  );
}

async function setServicesConfig() {
  try {
    const serviceFolders = await readdir(servicesBasePath);
    const { passphrase, publicKey, privateKey } = await generateKeyPair();

    await Promise.all(
      serviceFolders.map(async (name) => {
        log('info', `[Service ${name}] `, 'Setting up.');
        const serviceBasePath = resolve(servicesBasePath, name);
        try {
          log('info', `[Service ${name}] `, 'Fetching Service Details.');
          const serviceDetailsContent = await readFile(`${serviceBasePath}/service-details.json`, { encoding: 'utf8' });
          const details = JSON.parse(serviceDetailsContent);

          log('info', `[Service ${name}] `, 'Building service env file.');
          if (details.type === 'api')
            await buildApiEnvFile(name, details, serviceBasePath, passphrase, publicKey, privateKey, serviceFolders);
          if (details.type === 'ui') await buildUiEnvFile(name, details, serviceBasePath, serviceFolders);
        } catch (error) {
          log('error', `[Service ${name}] Error: `, error);
        }
      })
    );
  } catch (error) {
    log('error', error);
  }
}

function parseValue(value: unknown) {
  switch (typeof value) {
    case 'string':
    case 'number':
    case 'string':
    case 'boolean':
      return `"${value}"`;
      break;
    case 'object':
      return `'${JSON.stringify(value)}'`;
      break;
    default:
      throw new Error(`Unsupported type ${typeof value}`);
  }
}

async function writeObjectToEnvFile(obj, serviceBasePath: string, filePath = '.env', format = 'dotenv') {
  log('info', `[Service ${obj.SERVICE_NAME}] `, `Writing ${chalk.grey(filePath)} file.`);
  const envFilePath = resolve(serviceBasePath, filePath);

  const envFileContent =
    format === 'dotenv'
      ? Object.entries(obj)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => `${key}=${parseValue(value)}`)
          .join('\n')
      : format === 'json'
        ? JSON.stringify(obj, null, 2)
        : '';
  await writeFile(envFilePath, envFileContent);
}

async function getServicesConfig() {
  const data = [];
  try {
    const serviceFolders = await readdir(servicesBasePath);

    await Promise.all(
      serviceFolders.map(async (serviceFolder) => {
        const serviceBasePath = resolve(servicesBasePath, serviceFolder);
        const existingEnv = getServiceDotenv(serviceBasePath);

        if (!existingEnv) return;

        try {
          // TODO: use joi to process and convert the env vars
          existingEnv.APP_CONFIG = existingEnv?.APP_CONFIG ? JSON.parse(existingEnv.APP_CONFIG) : undefined;

          existingEnv.DB_CONFIG = existingEnv?.DB_CONFIG ? JSON.parse(existingEnv.DB_CONFIG) : undefined;

          existingEnv.INTERSERVICE_TRANSPORT_CONFIG = existingEnv?.INTERSERVICE_TRANSPORT_CONFIG
            ? JSON.parse(existingEnv.INTERSERVICE_TRANSPORT_CONFIG)
            : undefined;

          data.push(existingEnv);
        } catch (error) {
          log('error', `[Service ${serviceFolder}] Error: `, error);
        }
      })
    );
  } catch (error) {
    log('error', error);
  }
  return data;
}

const runQueryWithSchemaBinding = async (services, query: string) => {
  if (!services.length) return log('error', 'No services with db config found. did you run `cli setup env`?');

  await Promise.all(
    services.map(async (service) => {
      const dbConfig = service.DB_CONFIG;
      const appBasePath = resolve(servicesBasePath, service.SERVICE_NAME);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const dbConnection = await require(`${appBasePath}/src/db/cli-config`).default;
      const queryRunner = async (query: string) =>
        dbConnection
          .initialize()
          .then((connection) => connection.query(query).then(() => connection.destroy()))
          .catch(log);
      await queryRunner(query.replace(/\{\}/g, dbConfig.schema));
    })
  );
};

program.name('cli').description('CLI for AppCompass').version('0.0.1');

const bootstrap = async () => {
  const services = await getServicesConfig();
  const dbServices = services.filter((service) => service.DB_CONFIG);
  const setup = program
    .command('setup')
    .description('setup services')
    .action(() => {
      log('info', 'setup services');
    });

  setup
    .command('env')
    .description('setup services env files')
    // .requiredOption('-i, --interservice-protocol <protocol>', 'protocol used for inter service communication', 'nats')
    .action(async () => {
      log('info', 'setup services env files');
      await setServicesConfig();
    });

  const db = setup
    .command('db')
    .description("setup services' db schemas")
    .action(() => {
      log('info', 'work with the db');
    });

  const schema = db
    .command('schema')
    .description('setup services db schemas')
    .action(async () => {
      log('info', 'setup db schemas');
    });

  schema
    .command('create')
    .description('create services db schemas')
    .action(async () => {
      await runQueryWithSchemaBinding(dbServices, 'create schema if not exists {};');
    });

  schema
    .command('drop')
    .description('drop services db schemas')
    .action(async () => {
      await runQueryWithSchemaBinding(dbServices, 'drop schema if exists {} cascade;');
    });

  schema
    .command('reset')
    .description('drop and re-create services db schemas')
    .action(async () => {
      await runQueryWithSchemaBinding(dbServices, 'drop schema if exists {} cascade; create schema {};');
    });

  program.parse();
};

bootstrap();

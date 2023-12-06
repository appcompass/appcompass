import { writeFileSync } from 'fs';
import * as Joi from 'joi';
import { resolve } from 'path';

const arg = process.argv[process.argv.length - 1].trim();
const parsedArg = Object.fromEntries([arg.split(':')]);

const validator = Joi.object({
  setup: Joi.string().valid('env')
});

const { error } = validator.validate({ ...parsedArg });

if (error) {
  throw new Error(`validation error: ${error.message}`);
}

const commands = {
  'setup:env': async () => {
    const appConfig = JSON.stringify({
      rateLimit: {
        max: 0
      }
    });
    try {
      writeFileSync(
        resolve(__dirname, '..', '.env'),
        `
SERVICE_NAME=authentication
SERVICE_PORT=3000
AUTH_EXPIRES_IN=86400
APP_CONFIG='${appConfig}'
`
      );
    } catch (error) {
      console.log(error);
    }
  }
};

commands[arg]();

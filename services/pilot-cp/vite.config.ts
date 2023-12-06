import { readFile } from 'node:fs/promises';
import { fileURLToPath, URL } from 'node:url';

import chalk from 'chalk';
import { defineConfig, HttpProxy } from 'vite';
import vuePugPlugin from 'vue-pug-plugin';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

const log = (type: string, msg: string, ...args: any[]) => {
  const prefix = '[vite server] ';
  const timestamp = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).format(new Date());

  const color = type === 'error' ? chalk.red : type === 'warn' ? chalk.yellow : chalk.cyan;
  const message = type === 'info' ? chalk.green(msg) : color(msg);
  console.log(chalk.grey(timestamp), color.bold(prefix), message, ...args);
};

const getProxies = (services: Array<{ name: string; api_url: string }>) => {
  return services.reduce((proxies, service) => {
    const rewriteRegex = new RegExp(`^/api/${service.name}/`);
    Object.assign(proxies, {
      [`/api/${service.name}/`]: {
        target: service.api_url,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(rewriteRegex, ''),
        configure: (proxy: HttpProxy.Server) => {
          proxy.on('error', (err) => {
            log('error', 'proxy error', err);
          });
          proxy.on('proxyReq', async (proxyReq, req) => {
            const target = `${proxyReq.method} ${proxyReq.protocol}//${proxyReq.getHeader('host')}${
              proxyReq.path
            }`;
            log('info', 'Request:', req.method, `/${req.url}`, '==>', target);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            log('info', 'Response:', proxyRes.statusCode, `/${req.url}`);
          });
        },
        secure: false
      }
    });
    return proxies;
  }, {});
};

const getViteConfig = async () => {
  try {
    const data = await readFile('./public/config.json');
    const config = JSON.parse(data.toString());
    return defineConfig({
      plugins: [
        vue({
          template: {
            preprocessOptions: {
              plugins: [vuePugPlugin]
            }
          }
        }),
        vueJsx()
      ],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        }
      },
      server: {
        strictPort: true,
        port: config.SERVICE_PORT,
        proxy: getProxies(config.SERVICES)
      }
    });
  } catch (error) {
    throw new Error(`Could not fetch config.json: ${error}`);
  }
};

// https://vitejs.dev/config/
export default defineConfig(getViteConfig());

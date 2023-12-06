import { get } from 'lodash/fp';

import type { AppConfig } from '@/types';

export class Config {
  config: AppConfig | {} = {};

  async setConfig(): Promise<Config> {
    try {
      const response = await fetch(`/config.json`);
      const json = await response.json();
      this.config = {
        ...json
      };
    } catch (error) {
      throw new Error(`Could not fetch config.json: ${error}`);
    }
    return this;
  }

  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    if (!Object.prototype.hasOwnProperty.call(this.config, key))
      throw Error(`there is no value set for the key ${key}.`);
    else return get(key, this.config);
  }
}

let config: Config;

export const fetchConfig = () => {
  if (config instanceof Config) return config;
  else {
    config = new Config();
    return config;
  }
};

export const useConfig = (): Config => {
  if (config instanceof Config) return config;
  else throw new Error('Config not initialized.');
};

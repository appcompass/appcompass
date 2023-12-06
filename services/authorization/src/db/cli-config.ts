import { resolve } from 'path';
import { DataSource } from 'typeorm';

import { cliConfig } from '@appcompass/common';

const connection: Promise<DataSource> = cliConfig(resolve(__dirname, '../..', '.env')).then(
  (config) => new DataSource(config)
);
export default connection;

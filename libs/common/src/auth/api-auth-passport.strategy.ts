import { Request } from 'express';
import { get } from 'lodash/fp';
import { Strategy } from 'passport-strategy';

export class APIAuthStrategy extends Strategy {
  apiKeyHeader: { header: string; prefix: string };
  name: string;
  verify: (apiKey: string, verified: (err: Error | null, user?: object, info?: object) => void, req?: Request) => void;
  passReqToCallback: boolean;

  constructor(
    header: { header: string; prefix: string },
    passReqToCallback: boolean,
    verify: (apiKey: string, verified: (err: Error | null, user?: object, info?: object) => void, req?: Request) => void
  ) {
    super();
    this.apiKeyHeader = header || { header: 'X-Api-Key', prefix: '' };
    if (!this.apiKeyHeader.header) this.apiKeyHeader.header = 'X-Api-Key';
    if (!this.apiKeyHeader.prefix) this.apiKeyHeader.prefix = '';
    this.apiKeyHeader.header = this.apiKeyHeader.header.toLowerCase();

    this.name = 'headerapikey';
    this.verify = verify;
    this.passReqToCallback = passReqToCallback || false;
  }

  authenticate(req: Request): void {
    const reqApiKeyHeader = get(this.apiKeyHeader.header, req.headers) as string;
    if (!reqApiKeyHeader) return this.fail(new Error('Missing API Key'), null);
    if (!!this.apiKeyHeader.prefix && !reqApiKeyHeader.startsWith(this.apiKeyHeader.prefix))
      return this.fail(
        new Error(
          `Invalid API Key prefix, '${this.apiKeyHeader.header} header should start with "${this.apiKeyHeader.prefix}"`
        ),
        null
      );

    const apiKey = reqApiKeyHeader.replace(new RegExp('^' + this.apiKeyHeader.prefix), '');
    const verified = (err: Error | null, user?: object, info?: object) => {
      if (err) return this.error(err);
      if (!user) return this.fail(info, null);
      this.success(user, info);
    };

    const optionalCallbackParams = [];
    if (this.passReqToCallback) optionalCallbackParams.push(req);
    this.verify(apiKey, verified, ...optionalCallbackParams);
  }
}

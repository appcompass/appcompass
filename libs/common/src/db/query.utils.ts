import { EntityManager, SelectQueryBuilder } from 'typeorm';

export const setUserForApp =
  (dbUserIdVarName: string) =>
  async ({ id: userId }, manager: EntityManager) =>
    Number.isInteger(userId) ? await manager.query(`set local ${dbUserIdVarName} = ${userId}`) : false;

export const existsQuery = <T>(builder: SelectQueryBuilder<T>) => `exists (${builder.getQuery()})`;

export const notExistsQuery = <T>(builder: SelectQueryBuilder<T>) => `not exists (${builder.getQuery()})`;

export const caseWhenExists = <T>(builder: SelectQueryBuilder<T>) =>
  `case when exists (${builder.getQuery()}) then true else false end`;

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { UsersService } from '../services/users.service';

@ValidatorConstraint({ name: 'isEmailUsed', async: true })
@Injectable()
export class EmailUsedValidator implements ValidatorConstraintInterface {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly usersService: UsersService
  ) {}
  async validate(email: string, args: ValidationArguments) {
    const isUsedCheck = args.constraints[0];
    try {
      const user = await this.dataSource.transaction(
        async (manager) => await this.usersService.findBy(manager, { email })
      );
      return isUsedCheck ? !!user : !user;
    } catch (error) {
      return isUsedCheck ? false : true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `user with email '${args.value}' already exists.`;
  }
}

export function IsEmailUsed(isUsedCheck: boolean, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsEmailUsed',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [isUsedCheck],
      options: validationOptions,
      validator: EmailUsedValidator
    });
  };
}

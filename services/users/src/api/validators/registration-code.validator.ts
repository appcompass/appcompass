import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { UsersService } from '../services/users.service';

@ValidatorConstraint({ name: 'isRegistrationCode', async: true })
@Injectable()
export class RegistrationCodeValidator implements ValidatorConstraintInterface {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly usersService: UsersService
  ) {}
  async validate(activationCode: string) {
    const user = await this.dataSource.transaction(async (manager) => {
      try {
        return await this.usersService.findBy(manager, { activationCode });
      } catch (error) {
        return null;
      }
    });
    return !!user;
  }

  defaultMessage() {
    return 'Activation code not valid.';
  }
}

export function IsRegistrationCode(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsRegistrationCode',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: RegistrationCodeValidator
    });
  };
}

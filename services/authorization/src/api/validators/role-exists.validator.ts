import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { RolesService } from '../services/roles.service';

@ValidatorConstraint({ name: 'RoleExists', async: true })
@Injectable()
export class RoleExistsValidator implements ValidatorConstraintInterface {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly rolesService: RolesService
  ) {}
  async validate(name: string, args: ValidationArguments) {
    const roleExistsCheck = args.constraints[0];
    const role = await this.dataSource.transaction(
      async (manager) => await this.rolesService.findBy(manager, { name })
    );
    return roleExistsCheck ? !!role : !role;
  }

  defaultMessage(args: ValidationArguments) {
    return `role with name '${args.value}' already exists.`;
  }
}

export function RoleExists(roleExistsCheck: boolean, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'RoleExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [roleExistsCheck],
      options: validationOptions,
      validator: RoleExistsValidator
    });
  };
}

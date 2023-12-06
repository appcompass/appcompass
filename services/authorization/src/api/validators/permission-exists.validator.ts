import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { PermissionsService } from '../services/permissions.service';

@ValidatorConstraint({ name: 'PermissionExists', async: true })
@Injectable()
export class PermissionExistsValidator implements ValidatorConstraintInterface {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly permissionsService: PermissionsService
  ) {}
  async validate(name: string, args: ValidationArguments) {
    const permissionExistsCheck = args.constraints[0];
    const permission = await this.dataSource.transaction(
      async (manager) => await this.permissionsService.findBy(manager, { name })
    );
    return permissionExistsCheck ? !!permission : !permission;
  }

  defaultMessage(args: ValidationArguments) {
    return `permission with name '${args.value}' already exists.`;
  }
}

export function PermissionExists(permissionExistsCheck: boolean, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'PermissionExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [permissionExistsCheck],
      options: validationOptions,
      validator: PermissionExistsValidator
    });
  };
}

import { DataSource } from 'typeorm';

import { Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common';

import { PermissionsService } from '../services/permissions.service';

@Injectable()
export class NotSystemPermissionPipe implements PipeTransform {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly permissionService: PermissionsService
  ) {}
  async transform(id: string) {
    const permission = await this.dataSource.transaction(
      async (manager) => await this.permissionService.findBy(manager, { id, system: false })
    );

    if (!permission) throw new UnprocessableEntityException(`A none system Permission by id: ${id}, doesn't exist.`);
    return id;
  }
}

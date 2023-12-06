import { DataSource } from 'typeorm';

import { Injectable, PipeTransform, UnprocessableEntityException } from '@nestjs/common';

import { RolesService } from '../services/roles.service';

@Injectable()
export class NotSystemRolePipe implements PipeTransform {
  constructor(
    protected readonly dataSource: DataSource,
    protected readonly roleService: RolesService
  ) {}
  async transform(id: string) {
    const role = await this.dataSource.transaction(
      async (manager) => await this.roleService.findBy(manager, { id, system: false })
    );

    if (!role) throw new UnprocessableEntityException(`A none system Role by id: ${id}, doesn't exist.`);
    return id;
  }
}

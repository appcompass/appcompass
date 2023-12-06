import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';

class PaginationDto {
  @IsNumber()
  skip: number;
  @IsNumber()
  take: number;
  @IsNumber()
  total: number;
}

export class PaginatedResponse<T> {
  @IsArray()
  data: Array<T>;

  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;
}

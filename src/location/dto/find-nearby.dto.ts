import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindNearbyDto {
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @Type(() => Number)
  @IsNumber()
  radius: number; // 반경(km)

  @Type(() => Number)
  @IsNumber()
  limit: number; // 가져올 갯수
}

import { Location } from '../../typeorm/entity/location.entity';
import { CreateLocationDto } from '../dto/create-location.dto';

export interface LocationRepositoryInterface {
  findAll(): Promise<Location[]>;

  findNearby(params: {
    latitude: number;
    longitude: number;
    radius: number;
    limit: number;
  }): Promise<(Location & { distance: number })[]>;

  create(dto: CreateLocationDto): Promise<Location>;
}

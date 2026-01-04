import { Injectable } from '@nestjs/common';
import { Location } from '../../typeorm/entity/location.entity';
import { CreateLocationDto } from '../dto/create-location.dto';
import { LocationRepository } from '../repository/location.repository';
import { FindNearbyDto } from '../dto/find-nearby.dto';

@Injectable()
export class LocationService {
  constructor(private readonly locationRepository: LocationRepository) {}

  async findAll(): Promise<Location[]> {
    return await this.locationRepository.findAll();
  }

  async findNearby(
    dto: FindNearbyDto,
  ): Promise<(Location & { distance: number })[]> {
    const { latitude, longitude, radius, limit } = dto;

    return await this.locationRepository.findNearby({
      latitude,
      longitude,
      radius,
      limit,
    });
  }

  async create(dto: CreateLocationDto): Promise<Location> {
    return await this.locationRepository.create(dto);
  }
}

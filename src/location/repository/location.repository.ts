import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Location } from '../../typeorm/entity/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationRepositoryInterface } from '../interface/location-repository.interface';

@Injectable()
export class LocationRepository implements LocationRepositoryInterface {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async findAll(): Promise<Location[]> {
    return await this.locationRepository.find();
  }

  /**
   * 주어진 좌표 기준으로 반경(km) 이내의 위치들을 거리순으로 조회
   *
   * @param params - 검색 파라미터
   * @param params.latitude - 기준 위도
   * @param params.longitude - 기준 경도
   * @param params.radius - 검색 반경 (km)
   * @param params.limit - 최대 결과 개수
   * @returns 위치 정보와 거리(km)를 포함한 배열 (거리순 정렬)
   */
  async findNearby(params: {
    latitude: number;
    longitude: number;
    radius: number;
    limit: number;
  }): Promise<(Location & { distance: number })[]> {
    const { latitude, longitude, radius, limit } = params;

    const query = this.locationRepository
      .createQueryBuilder('location')
      .select([
        'location.id AS id',
        'location.name AS name',
        'location.latitude AS latitude',
        'location.longitude AS longitude',
        'location.createdAt AS createdAt',
      ])
      .addSelect(
        `(6371 * acos(
          cos(radians(:lat)) * cos(radians(location.latitude)) *
          cos(radians(location.longitude) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(location.latitude))
        ))`,
        'distance',
      )
      .having('distance < :radius')
      .orderBy('distance', 'ASC')
      .limit(limit)
      .setParameters({ lat: latitude, lng: longitude, radius });

    return await query.getRawMany();
  }

  async create(dto: DeepPartial<Location>): Promise<Location> {
    const location = this.locationRepository.create(dto);
    return await this.locationRepository.save(location);
  }
}

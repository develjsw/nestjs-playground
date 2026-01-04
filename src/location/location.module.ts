import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './service/location.service';
import { LocationRepository } from './repository/location.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from '../typeorm/entity/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  exports: [LocationService],
})
export class LocationModule {}

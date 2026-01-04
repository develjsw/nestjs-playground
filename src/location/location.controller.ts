import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { LocationService } from './service/location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { FindNearbyDto } from './dto/find-nearby.dto';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  @Get('nearby')
  findNearby(@Query() dto: FindNearbyDto) {
    return this.locationService.findNearby(dto);
  }

  @Post()
  create(@Body() dto: CreateLocationDto) {
    return this.locationService.create(dto);
  }
}

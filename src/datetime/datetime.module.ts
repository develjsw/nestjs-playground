import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatetimeController } from './datetime.controller';
import { DatetimeService } from './service/datetime.service';
import { DatetimeEntity } from './entity/datetime.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatetimeEntity])],
  controllers: [DatetimeController],
  providers: [DatetimeService],
  exports: [DatetimeService],
})
export class DatetimeModule {}

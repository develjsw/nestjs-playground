import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatetimeEntity } from '../entity/datetime.entity';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class DatetimeService {
  constructor(
    @InjectRepository(DatetimeEntity)
    private readonly datetimeRepository: Repository<DatetimeEntity>,
  ) {}

  async findAll(): Promise<DatetimeEntity[]> {
    return this.datetimeRepository.find();
  }

  async findOne(id: number): Promise<DatetimeEntity | null> {
    return this.datetimeRepository.findOne({ where: { id } });
  }

  async createWithTimezone(dateStr: string, timezone: string = 'Asia/Seoul') {
    const date = dayjs.tz(dateStr, timezone); // timezone이 적용된 로컬시각

    const entity = this.datetimeRepository.create({
      datetimeUtc: date.utc().format('YYYY-MM-DD HH:mm:ss'), // utc로 변환해 저장
      timezone, // timezone 같이 저장
    });

    return this.datetimeRepository.save(entity);
  }

  getTimezoneExamples() {
    const timezones = [
      'UTC',
      'Asia/Seoul',
      'America/New_York',
      'Europe/London',
      'Asia/Tokyo',
      'Australia/Sydney',
    ];

    const now = dayjs();

    return timezones.map((timezone) => ({
      timezone: timezone,
      current: now.tz(timezone).format('YYYY-MM-DD HH:mm:ss'),
      offset: now.tz(timezone).format('Z'),
      iso: now.tz(timezone).toISOString(),
    }));
  }
}

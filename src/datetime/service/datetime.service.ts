import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { DatetimeEntity } from '../entity/datetime.entity';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class DatetimeService {
  constructor(
    @InjectRepository(DatetimeEntity)
    private readonly datetimeRepository: Repository<DatetimeEntity>,
  ) {}

  /**
   * 모든 레코드 조회
   */
  async findAll(): Promise<DatetimeEntity[]> {
    return this.datetimeRepository.find();
  }

  /**
   * ID로 단일 레코드 조회
   */
  async findOne(id: number): Promise<DatetimeEntity | null> {
    return this.datetimeRepository.findOne({ where: { id } });
  }

  /**
   * 기본 데이터 삽입 (현재 시간 기준)
   */
  async createWithCurrentTime(tz: string = 'Asia/Seoul') {
    const now = dayjs();

    const entity = this.datetimeRepository.create({
      dateOnly: now.toDate(),
      datetimeValue: now.toDate(),
      timezone: tz,
      datetimeUtc: now.utc().toDate(),
      timestampAutoUtc: now.utc().toDate(),
    });

    return this.datetimeRepository.save(entity);
  }

  /**
   * 특정 timezone으로 데이터 삽입
   */
  async createWithTimezone(dateStr: string, tz: string = 'Asia/Seoul') {
    const date = dayjs.tz(dateStr, tz);

    const entity = this.datetimeRepository.create({
      dateOnly: date.toDate(),
      datetimeValue: date.toDate(),
      timezone: tz,
      datetimeUtc: date.utc().toDate(),
      timestampAutoUtc: date.utc().toDate(),
    });

    return this.datetimeRepository.save(entity);
  }

  /**
   * ISO 8601 형식으로 삽입
   */
  async createWithISO(isoString: string, tz: string = 'UTC') {
    const date = dayjs(isoString);

    const entity = this.datetimeRepository.create({
      dateOnly: date.toDate(),
      datetimeValue: date.toDate(),
      timezone: tz,
      datetimeUtc: date.utc().toDate(),
      timestampAutoUtc: date.utc().toDate(),
    });

    return this.datetimeRepository.save(entity);
  }

  /**
   * UTC offset을 적용한 데이터 삽입
   */
  async createWithOffset(dateStr: string, offsetHours: number = 9) {
    const date = dayjs(dateStr).utcOffset(offsetHours);

    const entity = this.datetimeRepository.create({
      dateOnly: date.toDate(),
      datetimeValue: date.toDate(),
      timezone: `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`,
      datetimeUtc: date.utc().toDate(),
      timestampAutoUtc: date.utc().toDate(),
    });

    return this.datetimeRepository.save(entity);
  }

  /**
   * 레코드의 timezone을 변환하여 조회
   */
  async findWithTimezoneConversion(id: number, targetTz: string) {
    const entity = await this.findOne(id);
    if (!entity) return null;

    return {
      original: entity,
      converted: {
        dateOnly: dayjs(entity.dateOnly).tz(targetTz).format('YYYY-MM-DD'),
        datetimeValue: dayjs(entity.datetimeValue)
          .tz(targetTz)
          .format('YYYY-MM-DD HH:mm:ss'),
        datetimeUtc: dayjs(entity.datetimeUtc)
          .tz(targetTz)
          .format('YYYY-MM-DD HH:mm:ss'),
        timestampAutoUtc: dayjs(entity.timestampAutoUtc)
          .tz(targetTz)
          .format('YYYY-MM-DD HH:mm:ss'),
        timezone: targetTz,
      },
      iso: {
        dateOnly: dayjs(entity.dateOnly).toISOString(),
        datetimeValue: dayjs(entity.datetimeValue).toISOString(),
        datetimeUtc: dayjs(entity.datetimeUtc).toISOString(),
        timestampAutoUtc: dayjs(entity.timestampAutoUtc).toISOString(),
      },
    };
  }

  /**
   * 레코드 삭제
   */
  async remove(id: number) {
    return this.datetimeRepository.delete(id);
  }

  /**
   * 모든 레코드 삭제
   */
  async removeAll() {
    return this.datetimeRepository.clear();
  }

  /** Timezone 목록 조회 (테스트용) */
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

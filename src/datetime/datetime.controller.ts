import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { DatetimeService } from './service/datetime.service';
import {
  CreateDatetimeDto,
  CreateWithTimezoneDto,
  CreateWithISODto,
  CreateWithOffsetDto,
} from './dto/create-datetime.dto';

@Controller('datetime')
export class DatetimeController {
  constructor(private readonly datetimeService: DatetimeService) {}

  /**
   * 모든 레코드 조회
   */
  @Get()
  async findAll() {
    return this.datetimeService.findAll();
  }

  /**
   * 다양한 timezone의 현재 시간 조회 (테스트용)
   */
  @Get('timezones')
  getTimezones() {
    return this.datetimeService.getTimezoneExamples();
  }

  /**
   * 특정 레코드 조회
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.datetimeService.findOne(+id);
  }

  /**
   * 특정 레코드를 원하는 timezone으로 변환하여 조회
   */
  @Get(':id/convert')
  async findWithConversion(
    @Param('id') id: string,
    @Query('tz') tz: string = 'Asia/Seoul',
  ) {
    return this.datetimeService.findWithTimezoneConversion(+id, tz);
  }

  /**
   * 현재 시간으로 레코드 생성
   */
  @Post('current')
  async createCurrent(@Body() body: CreateDatetimeDto) {
    return this.datetimeService.createWithCurrentTime(
      body.timezone || 'Asia/Seoul',
    );
  }

  /**
   * 특정 timezone의 날짜로 레코드 생성
   */
  @Post('timezone')
  async createWithTimezone(@Body() body: CreateWithTimezoneDto) {
    return this.datetimeService.createWithTimezone(
      body.dateStr,
      body.timezone,
    );
  }

  /**
   * ISO 8601 형식으로 레코드 생성
   */
  @Post('iso')
  async createWithISO(@Body() body: CreateWithISODto) {
    return this.datetimeService.createWithISO(body.isoString, body.timezone);
  }

  /**
   * UTC offset을 적용하여 레코드 생성
   */
  @Post('offset')
  async createWithOffset(@Body() body: CreateWithOffsetDto) {
    return this.datetimeService.createWithOffset(
      body.dateStr,
      body.offsetHours,
    );
  }

  /**
   * 특정 레코드 삭제
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.datetimeService.remove(+id);
  }

  /**
   * 모든 레코드 삭제
   */
  @Delete()
  async removeAll() {
    return this.datetimeService.removeAll();
  }
}

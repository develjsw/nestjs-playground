import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { DatetimeService } from './service/datetime.service';
import { CreateDatetimeWithTimezoneDto } from './dto/create-datetime.dto';

@Controller('datetime')
export class DatetimeController {
  constructor(private readonly datetimeService: DatetimeService) {}

  @Get()
  async getDatetimeList() {
    return this.datetimeService.getDatetimeList();
  }

  @Get('timezones')
  getTimezoneList() {
    return this.datetimeService.getTimezoneList();
  }

  @Get(':id')
  async getDatetimeDetail(@Param('id') id: string) {
    return this.datetimeService.getDatetimeDetail(+id);
  }

  @Post('timezone')
  async createDatetimeWithTimezone(
    @Body() body: CreateDatetimeWithTimezoneDto,
  ) {
    return this.datetimeService.createDatetimeWithTimezone(
      body.dateStr,
      body.timezone,
    );
  }
}

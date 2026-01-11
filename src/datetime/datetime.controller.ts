import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { DatetimeService } from './service/datetime.service';
import { CreateDatetimeWithTimezoneDto } from './dto/create-datetime.dto';

@Controller('datetime')
export class DatetimeController {
  constructor(private readonly datetimeService: DatetimeService) {}

  @Get()
  async findAll() {
    return this.datetimeService.findAll();
  }

  @Get('timezones')
  getTimezones() {
    return this.datetimeService.getTimezoneExamples();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.datetimeService.findOne(+id);
  }

  @Post('timezone')
  async createWithTimezone(@Body() body: CreateDatetimeWithTimezoneDto) {
    return this.datetimeService.createWithTimezone(body.dateStr, body.timezone);
  }
}

export class CreateDatetimeDto {
  timezone?: string;
}

export class CreateWithTimezoneDto {
  dateStr: string;
  timezone: string;
}

export class CreateWithISODto {
  isoString: string;
  timezone?: string;
}

export class CreateWithOffsetDto {
  dateStr: string;
  offsetHours: number;
}

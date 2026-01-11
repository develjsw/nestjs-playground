import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('datetime')
export class DatetimeEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'date', name: 'date_only' })
  dateOnly: Date;

  @Column({ type: 'datetime', name: 'datetime_value' })
  datetimeValue: Date;

  @Column({ type: 'varchar', length: 32 })
  timezone: string;

  @Column({ type: 'datetime', name: 'datetime_utc' })
  datetimeUtc: Date;

  @Column({
    type: 'timestamp',
    name: 'timestamp_auto_utc',
  })
  timestampAutoUtc: Date;
}

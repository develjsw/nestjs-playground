import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('datetime')
export class DatetimeEntity {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'datetime', name: 'datetime_utc' })
  datetimeUtc: Date;

  @Column({ type: 'varchar', length: 32 })
  timezone: string;
}

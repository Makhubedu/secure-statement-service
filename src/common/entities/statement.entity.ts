import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Customer } from './customer.entity';
import { StatementStatus } from '../enums';
import { DownloadLog } from './download-log.entity';

@Entity('statements')
export class Statement extends BaseEntity {
  @Column()
  fileName: string; // Generated filename (UUID + .pdf)

  @Column()
  originalFileName: string; // Original PDF filename from upload

  @Column()
  fileSizeBytes: number; // PDF file size in bytes

  @Column({ default: 'application/pdf' })
  mimeType: string;

  @Column()
  storagePath: string; // MinIO storage path

  @Column({ type: 'date' })
  statementDate: Date;

  @Column({ type: 'varchar', length: 7 }) // YYYY-MM format
  statementPeriod: string;

  @Column({
    type: 'enum',
    enum: StatementStatus,
    default: StatementStatus.UPLOADED,
  })
  status: StatementStatus;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ default: 0 })
  downloadCount: number;

  @Column({ nullable: true })
  uploadedBy: string;

  @ManyToOne(() => Customer, (customer) => customer.statements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @OneToMany(() => DownloadLog, (downloadLog) => downloadLog.statement)
  downloadLogs: DownloadLog[];

  get isExpired(): boolean {
    return this.expiresAt && new Date() > this.expiresAt;
  }

  get isDownloadable(): boolean {
    return this.status === StatementStatus.AVAILABLE && !this.isExpired;
  }

  get isPdf(): boolean {
    return this.mimeType === 'application/pdf' && this.fileName.endsWith('.pdf');
  }

  get fileSizeMB(): number {
    return Math.round((this.fileSizeBytes / (1024 * 1024)) * 100) / 100;
  }
}
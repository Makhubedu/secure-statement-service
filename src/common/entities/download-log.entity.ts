import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Statement } from './statement.entity';
import { DownloadStatus } from '../enums';

@Entity('download_logs')
export class DownloadLog extends BaseEntity {
  @ManyToOne(() => Statement, (statement) => statement.downloadLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'statementId' })
  statement: Statement;

  @Column()
  statementId: string;

  @Column()
  userId: string; // SuperTokens userId who downloaded

  @Column()
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({
    type: 'enum',
    enum: DownloadStatus,
  })
  status: DownloadStatus;

  @Column({ nullable: true })
  downloadToken: string;

  @Column({ type: 'timestamp', nullable: true })
  tokenExpiresAt: Date;

  @Column({ nullable: true })
  errorMessage: string;

  @Column({ type: 'timestamp', nullable: true })
  downloadCompletedAt: Date;

  get downloadDuration(): number | null {
    if (this.downloadCompletedAt && this.createdAt) {
      return this.downloadCompletedAt.getTime() - this.createdAt.getTime();
    }
    return null;
  }
}
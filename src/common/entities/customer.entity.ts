import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Statement } from './statement.entity';

@Entity('customers')
export class Customer extends BaseEntity {
  @Column({ unique: true })
  customerNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Statement, (statement) => statement.customer)
  statements: Statement[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Transaction } from "./transaction.entity";

export enum RepeatType {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column("float", { default: 0 })
  currentAmount!: number;

  @Column("float", { default: 0 })
  maxAmount!: number;

  @Column({ type: "date", nullable: true })
  startDate!: string;

  @Column({ type: "date", nullable: true })
  endDate!: string;

  @Column({ default: false })
  isRepeatable!: boolean;

  @Column({
    type: "text",
    nullable: true,
  })
  repeatType!: RepeatType | null;

  @ManyToOne(() => User, user => user.budgets, { onDelete: "CASCADE" })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Transaction, transaction => transaction.budget)
  transactions!: Transaction[];
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Budget } from "./budget.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Budget, budget => budget.user)
  budgets!: Budget[];
}

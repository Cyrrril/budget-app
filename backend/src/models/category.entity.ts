import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transaction } from "./transaction.entity";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  icon!: string; // For react-icons (e.g. "SiSpotify")

  @Column({ nullable: true })
  iconUrl!: string; // For custom icons

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions!: Transaction[];
}
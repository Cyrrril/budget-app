import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { Budget } from "./budget.entity";
  import { Category } from "./category.entity";
  
  @Entity()
  export class Transaction {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    name!: string;
  
    @Column("decimal")
    amount!: number;
  
    @Column()
    date!: string; // store as ISO string
  
    @ManyToOne(() => Budget, budget => budget.transactions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "budget_id" })
    budget!: Budget;
  
    @ManyToOne(() => Category, category => category.transactions, { onDelete: "SET NULL" })
    @JoinColumn({ name: "category_id" })
    category!: Category;
  }
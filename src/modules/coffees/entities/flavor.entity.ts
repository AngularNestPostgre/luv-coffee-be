import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Coffee } from './coffee.entity';

@Entity()
// SQL table name => 'flavor'
export class Flavor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Coffee, (coffee) => coffee.flavors)
  coffees: Coffee[];

  toJSON() {
    return { name: this.name, coffees: this.coffees };
  }
}

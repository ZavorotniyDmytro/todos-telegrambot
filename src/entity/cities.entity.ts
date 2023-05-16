
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class SelectedCity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  user_telegram_id: number

  @Column({ type: 'varchar', length: 50 })
  city_name: string

  @Column({ default: 1 })
  usage_counter: number

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date
}


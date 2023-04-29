import { Column, CreateDateColumn, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

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

  @Index(['user_telegram_id', 'city_name'], { unique: true })
  userAndCityIndex: string;
}
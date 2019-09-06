import { Column, Entity, PrimaryGeneratedColumn, getRepository, ManyToOne, ManyToMany, JoinTable } from 'typeorm'
import User from '../auth/auth.entity'
import Category from '../category/category.entity'

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id?: number

  @Column()
  public title: string

  @Column()
  public content: string

  @ManyToOne(() => User, user => user.posts)
  public author: User

  @ManyToMany(() => Category, category => category.posts)
  @JoinTable()
  public categories: Category[]
}

export default Post

import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import Post from '../posts/post.entity'

@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id: string

  @Column()
  public name: string

  @ManyToMany(() => Post, post => post.categories)
  public posts: Post[]
}

export default Category

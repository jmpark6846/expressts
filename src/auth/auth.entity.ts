import { Column, Entity, PrimaryGeneratedColumn, getRepository, OneToMany } from 'typeorm'
import Post from '../posts/post.entity'

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @Column()
  public email: string

  @Column({ select: false })
  public password: string

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[]
}

export class SignInData {
  email: string
  password: string
}

export default User

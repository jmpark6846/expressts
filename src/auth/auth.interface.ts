import mongoose, { Types } from 'mongoose'

export interface TokenData {
  token: string
  expiresIn: number
}

export interface DataStoredInToken {
  id: number
}

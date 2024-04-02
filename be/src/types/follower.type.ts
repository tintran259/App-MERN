import { ObjectId } from 'mongodb'

export type FollowerTypeModal = {
  user_id: ObjectId
  follower_user_id: ObjectId
  created_at?: Date
  updated_at?: Date
}

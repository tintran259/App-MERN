import { ObjectId } from 'mongodb'
import { FollowerTypeModal } from '~/types/follower.type'

export default class FollowerModal {
  user_id: ObjectId
  follower_user_id: ObjectId
  created_at?: Date
  updated_at?: Date

  constructor(item: FollowerTypeModal) {
    this.user_id = item.user_id
    this.follower_user_id = item.follower_user_id
    ;(this.created_at = item.created_at), (this.updated_at = item.updated_at)
  }
}

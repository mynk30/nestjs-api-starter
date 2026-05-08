import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { BaseRepository } from '../database/base.repository';
import { User } from './schemas/user.schema';

export type UserDocument = User & Document;

@Injectable()
export class UsersRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }

  // You can add user-specific methods here
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.findOne({ email });
  }
}

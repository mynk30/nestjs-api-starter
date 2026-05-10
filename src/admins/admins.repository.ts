import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../database/base.repository';
import { Admin, AdminDocument } from './schemas/admin.schema';

@Injectable()
export class AdminsRepository extends BaseRepository<AdminDocument> {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<AdminDocument>,
  ) {
    super(adminModel);
  }

  async findByEmail(email: string): Promise<AdminDocument | null> {
    return this.findOne({ email });
  }
}

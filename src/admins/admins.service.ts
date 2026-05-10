import { Injectable } from '@nestjs/common';
import { AdminsRepository } from './admins.repository';
import { AdminDocument } from './schemas/admin.schema';

@Injectable()
export class AdminsService {
  constructor(private readonly adminsRepository: AdminsRepository) {}

  async create(data: any): Promise<AdminDocument> {
    return this.adminsRepository.create(data);
  }

  async findByEmail(email: string): Promise<AdminDocument | null> {
    return this.adminsRepository.findByEmail(email);
  }

  async findById(id: string): Promise<AdminDocument | null> {
    return this.adminsRepository.findById(id);
  }
}

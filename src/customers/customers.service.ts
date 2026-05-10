import { Injectable } from '@nestjs/common';
import { CustomersRepository } from './customers.repository';
import { CustomerDocument } from './schemas/customer.schema';

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async create(data: any): Promise<CustomerDocument> {
    return this.customersRepository.create(data);
  }

  async findByEmail(email: string): Promise<CustomerDocument | null> {
    return this.customersRepository.findByEmail(email);
  }

  async findById(id: string): Promise<CustomerDocument | null> {
    return this.customersRepository.findById(id);
  }
}

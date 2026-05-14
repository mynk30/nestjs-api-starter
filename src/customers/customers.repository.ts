import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../database/base.repository';
import { Customer, CustomerDocument } from './schemas/customer.schema';

@Injectable()
export class CustomersRepository extends BaseRepository<CustomerDocument> {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {
    super(customerModel);
  }

  async findByEmail(email: string): Promise<CustomerDocument | null> {
    return this.findOne({ email });
  }

  async findAllCustomers(): Promise<CustomerDocument[]> {
    return this.customerModel.find().exec();
  }

  async findCustomerById(id: string): Promise<CustomerDocument | null> {
    return this.customerModel.findById(id).exec();
  }
}

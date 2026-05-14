import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CustomersRepository } from './customers.repository';
import { CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) { }

  async create(createCustomerDto: CreateCustomerDto, adminId?: string): Promise<CustomerDocument> {
    const { email, password } = createCustomerDto;

    // Check if customer already exists
    const existingCustomer = await this.customersRepository.findByEmail(email);
    if (existingCustomer) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create customer with hashed password
    // Note: adminId is received here and can be used if 'createdBy' is added to the schema later
    return this.customersRepository.create({
      ...createCustomerDto,
      password: hashedPassword,
    });
  }

  async findByEmail(email: string): Promise<CustomerDocument | null> {
    return this.customersRepository.findByEmail(email);
  }

  async findById(id: string): Promise<any | null> {
    const customer = await this.customersRepository.findById(id);
    if (!customer) return null;

    const { password, refreshToken, ...result } = customer.toObject();
    return result;
  }

  async getAllCustomers(): Promise<CustomerDocument[]> {
    return this.customersRepository.findAll();
  }

  async getCustomerById(id: string): Promise<CustomerDocument | null> {
    return this.customersRepository.findById(id);
  }

  async updateProfile(id: string, updateCustomerDto: UpdateCustomerDto): Promise<CustomerDocument> {
    const customer = await this.customersRepository.updateById(id, updateCustomerDto);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async removeAccount(id: string): Promise<void> {
    const result = await this.customersRepository.updateById(id, { isActive: false });
    if (!result) {
      throw new NotFoundException('Customer not found');
    }
  }

  async changePassword(id: string, data: any): Promise<void> {
    const customer = await this.customersRepository.findById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const isMatch = await bcrypt.compare(data.oldPassword, customer.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect old password');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.newPassword, salt);

    await this.customersRepository.updateById(id, { password: hashedPassword });
  }

  async deleteCustomer(id: string): Promise<void> {
    const result = await this.customersRepository.deleteById(id);
    if (!result) {
      throw new NotFoundException('Customer not found');
    }
  }
}

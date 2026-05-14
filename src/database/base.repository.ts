import { Document, Model, UpdateQuery, QueryOptions } from 'mongoose';

// In Mongoose 8.4+, FilterQuery was replaced by QueryFilter in some versions or renamed.
// Using 'any' as a fallback if QueryFilter is also not found, but QueryFilter was found in the type definitions.
import { QueryFilter } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) { }

  async create(data: any): Promise<T> {
    const createdEntity = new this.model(data);
    return createdEntity.save();
  }

  async findAll(
    filter: QueryFilter<T> = {},
    options: QueryOptions = {},
  ): Promise<T[]> {
    return this.model.find(filter, null, options).exec();
  }

  async findOne(
    filter: QueryFilter<T>,
    options: QueryOptions = {},
  ): Promise<T | null> {
    return this.model.findOne(filter, null, options).exec();
  }

  async findById(id: string, options: QueryOptions = {}): Promise<T | null> {
    return this.model.findById(id, null, options).exec();
  }

  async updateById(
    id: string,
    data: UpdateQuery<T>,
    options: QueryOptions = { new: true },
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, options).exec();
  }

  async deleteById(id: string, options: QueryOptions = {}): Promise<T | null> {
    return this.model.findByIdAndDelete(id, options).exec();
  }

  async count(filter: QueryFilter<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async exists(filter: QueryFilter<T>): Promise<boolean> {
    const result = await this.model.exists(filter);
    return !!result;
  }
}

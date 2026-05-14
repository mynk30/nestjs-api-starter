import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'customers' })
export class Customer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  featured_image?: string;

  @Prop()
  phone?: string;

  @Prop()
  countryCode?: string;

  @Prop()
  alternatePhone?: string;

  @Prop()
  alternateCountryCode?: string;

  @Prop({ type: Number })
  otp: number;

  @Prop({ type: Date })
  otpExpiry: Date;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Admin' })
  createdBy: Types.ObjectId;
}


export type CustomerDocument = Customer & Document;
export const CustomerSchema = SchemaFactory.createForClass(Customer);

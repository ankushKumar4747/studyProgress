import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  streak: number;

  // planned study time (in minutes)
  @Prop({ default: 0 })
  studyMinutes: number;

  // actual studied time (in minutes)
  @Prop({ default: 0 })
  studiedMinutes: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }] })
  assignments: {
    ref: 'Assignment';
    type: mongoose.Schema.Types.ObjectId;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);

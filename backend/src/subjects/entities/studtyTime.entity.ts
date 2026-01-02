import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type StudyTimeDocument = HydratedDocument<StudyTime>;
@Schema({ timestamps: true })
export class StudyTime {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' })
  subjectId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  studyMinutes: number;

  @Prop({ required: true })
  studyDate: number;

  @Prop({ required: true })
  numberOfCompletedTopics: number;

}

export const StudyTimeSchema = SchemaFactory.createForClass(StudyTime);

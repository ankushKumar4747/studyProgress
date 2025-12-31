import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type StudyTimeDocument = HydratedDocument<StudyTime>;
@Schema()
export class StudyTime {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' })
  subjectId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  studyTime: number;

  @Prop({ required: true })
  studyDate: Date;
  
}

export const StudyTimeSchema = SchemaFactory.createForClass(StudyTime);

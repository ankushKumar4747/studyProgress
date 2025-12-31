import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubjectDocument = HydratedDocument<Subject>;

@Schema({ timestamps: true })
export class Subject {
  @Prop({ required: true })
  subjectName: string;

  @Prop({ required: true })
  totalChapter: number;

  @Prop([
    {
      _id: false, 
      name: { type: String, required: true },
      section: { type: String, required: true },
      subtopics: [
        {
          _id: false, 
          name: { type: String, required: true },
          isCompleted: { type: Boolean, default: false },
        },
      ],
    },
  ])
  chapters: {
    name: string;
    section: string;
    subtopics: {
      name: string;
      isCompleted: boolean;
    }[];
  }[];

  
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);

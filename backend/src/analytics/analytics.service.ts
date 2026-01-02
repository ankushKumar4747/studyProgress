import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Subject } from 'src/subjects/entities/subject.entity';
import { User } from 'src/auth/entities/user.entity';
import { StudyTime } from 'src/subjects/entities/studtyTime.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Subject') private subjectModel: Model<Subject>,
    @InjectModel('StudyTime') private studyTimeModel: Model<StudyTime>,
  ) {}

  
}

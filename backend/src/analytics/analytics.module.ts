import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/entities/user.entity';
import { Subject, SubjectSchema } from 'src/subjects/entities/subject.entity';
import { StudyTime, StudyTimeSchema } from 'src/subjects/entities/studtyTime.entity';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Subject', schema: SubjectSchema },
      { name: 'StudyTime', schema: StudyTimeSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

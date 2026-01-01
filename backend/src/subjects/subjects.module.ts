import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { SubjectSchema } from './entities/subject.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/auth/entities/user.entity';
import { StudyTimeSchema } from './entities/studtyTime.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Subject', schema: SubjectSchema },
      { name: 'User', schema: UserSchema },
      {name:"studyTime", schema:StudyTimeSchema}
    ]),
],
  controllers: [SubjectsController],
  providers: [SubjectsService],
})
export class SubjectsModule {}

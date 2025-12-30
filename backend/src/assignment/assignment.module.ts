import { Module } from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { AssignmentController } from './assignment.controller';
import { Assignment, AssignmentSchema } from './entities/assignment.entity';
import { Subject, SubjectSchema } from '../subjects/entities/subject.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from '../../Guards/jwt.guards';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Assignment', schema: AssignmentSchema },
      { name: 'Subject', schema: SubjectSchema },
    ]),
  ],
  controllers: [AssignmentController],
  providers: [AssignmentService, AuthGuard],
})
export class AssignmentModule {}

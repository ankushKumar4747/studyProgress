import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Subject } from '../subjects/entities/subject.entity';
// import { Assignment } from './entities/assignment.entity';
import { AuthGuard } from 'Guards/jwt.guards';



@Injectable()
export class AssignmentService {
  constructor(
 
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
  ) {}


  async createAssignment(createAssignmentDto: CreateAssignmentDto,userId:mongoose.Schema.Types.ObjectId) {
    const { subjects } = createAssignmentDto;


    const payload = subjects.map((subject) => ({
      ...subject,
      totalChapter: subject.chapters.length,
      userId,
    }));

    const result = await this.subjectModel.insertMany(payload);

    return {
      message: 'Subjects inserted successfully',
      insertedCount: result.length,
    };
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject } from '../subjects/entities/subject.entity';
import { Assignment } from './entities/assignment.entity';

@Injectable()
export class AssignmentService {
  constructor(
    @InjectModel('Assignment')
    private readonly assignmentModel: Model<Assignment>,
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
  ) {}


  async createAssignment(createAssignmentDto: CreateAssignmentDto) {
    const { subjects } = createAssignmentDto;

    // if (!subjects || subjects.length === 0) {
    //   throw new BadRequestException('Subjects array cannot be empty');
    // }

    const payload = subjects.map((subject) => ({
      ...subject,
      totalChapter: subject.chapters.length,
    }));

    const result = await this.subjectModel.insertMany(payload);

    return {
      message: 'Subjects inserted successfully',
      insertedCount: result.length,
    };
  }
}

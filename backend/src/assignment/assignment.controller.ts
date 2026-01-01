import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { Assignment } from './entities/assignment.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { AuthGuard } from '../../Guards/jwt.guards';

@UseGuards(AuthGuard)
@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post('createAssignment')
  async createAssingment(@Body() createAssignmentDto: CreateAssignmentDto,@Req() req: any) {
    try {
      const result =
        await this.assignmentService.createAssignment(createAssignmentDto,req.user.id);
      return result;
    } catch (e) {
      console.log(e.message);
      throw new ExceptionsHandler(e.message);
    }
  }
}

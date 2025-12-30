import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assignment } from './entities/assignment.entity';
import { Subject } from '../subjects/entities/subject.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { AuthGuard } from '../../Guards/jwt.guards';

@Controller('assignment')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @UseGuards(AuthGuard)
  @Post('createAssignment')
  async createAssingment(@Body() createAssignmentDto: CreateAssignmentDto) {
    try {
      const result =
        await this.assignmentService.createAssignment(createAssignmentDto);
      return result;
    } catch (e) {
      console.log(e.message);
      throw new ExceptionsHandler(e.message);
    }
  }
}

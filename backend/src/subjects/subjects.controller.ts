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
import { SubjectsService } from './subjects.service';
import { AuthGuard } from '../../Guards/jwt.guards';
import mongoose from 'mongoose';

@UseGuards(AuthGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}
  @Post('studyGoal')
  async studyGoal(@Body() body: { min: number }, @Req() req: any) {
    const userId = req.user.id;
    return this.subjectsService.studyGoal(userId, body.min);
  }

  @Get('studyGoal')
  async getStudyGoal(@Req() req: any) {
    const userId = req.user.id;
    return this.subjectsService.getStudyGoal(userId);
  }

  @Get('streak')
  async getStreak(@Req() req: any) {
    const userId = req.user.id;
    return this.subjectsService.getStreak(userId);
  }

  @Get('list')
  async getUserSubjects(@Req() req: any) {
    const userId = req.user.id;
    return this.subjectsService.getUserSubjects(userId);
  }

  @Get(':subjectId/progress')
  async getSubjectProgress(
    @Param('subjectId') subjectId: string,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.subjectsService.getSubjectProgress(subjectId, userId);
  }

  @Get('totalSubjectsWithData')
  async totalSubjectsWithData(@Req() req: any) {
    const userId = req.user.id;
    return this.subjectsService.totalSubjectsWithData(userId);
  }

  @Post('studyTimeUpdate')
  async updateStudyTime(
    @Body()
    studyTime: { min: number; subjectId: mongoose.Schema.Types.ObjectId },
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.subjectsService.updateStudyTime(userId, studyTime);
  }

  @Get('studyTime')
  async getStudyTime(@Req() req: any) {
    const userId = req.user.id;
    return this.subjectsService.getTodayStudyTime(userId);
  }

  @Get('weekly-focus')
  async getWeeklyFocusDistribution(@Req() req: any) {
    const userId = req.user.id;
    return this.subjectsService.getWeeklyFocusDistribution(userId);
  }

  @Get('weekly-mastery')
  async getWeeklyMastery(@Req() req: any) {
    const userId = req.user.id;
    return this.subjectsService.getWeeklyMastery(userId);
  }
}

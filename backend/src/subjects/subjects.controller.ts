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
import { Cron, CronExpression } from '@nestjs/schedule';

@UseGuards(AuthGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}
  @Post('studyGoal')
  async studyGoal(@Body() body: { min: number }, @Req() req: any) {
    try {
      const userId = req.user.id;
      return this.subjectsService.studyGoal(userId, body.min);
    } catch (e) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  @Get('studyGoal')
  async getStudyGoal(@Req() req: any) {
    try {
      const userId = req.user.id;
      return this.subjectsService.getStudyGoal(userId);
    } catch (e) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  @Get('streak')
  async getStreak(@Req() req: any) {
    try {
      const userId = req.user.id;
      return this.subjectsService.getStreak(userId);
    } catch (e) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  @Get('list')
  async getUserSubjects(@Req() req: any) {
    try {
      const userId = req.user.id;
      return this.subjectsService.getUserSubjects(userId);
    } catch (e) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  @Get(':subjectId/progress')
  async getSubjectProgress(
    @Param('subjectId') subjectId: string,
    @Req() req: any,
  ) {
    try {
      const userId = req.user.id;
      return this.subjectsService.getSubjectProgress(subjectId, userId);
    } catch (e) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  @Get('totalSubjectsWithData')
  async totalSubjectsWithData(@Req() req: any) {
    try {
      const userId = req.user.id;
      return this.subjectsService.totalSubjectsWithData(userId);
    } catch (e) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  @Post('studyTimeUpdate')
  async updateStudyTime(
    @Body()
    studyTime: {
      min: number;
      subjectId: mongoose.Schema.Types.ObjectId;
      numberOfCompletedTopics: number;
    },
    @Req() req: any,
  ) {
    try {
      const userId = req.user.id;
      return this.subjectsService.updateStudyTime(userId, studyTime);
    } catch (e) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  @Get('studyTime')
  async getStudyTime(@Req() req: any) {
    try {
      const userId = req.user.id;
      return this.subjectsService.getTodayStudyTime(userId);
    } catch (e) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  @Get('weekly-focus')
  async getWeeklyFocusDistribution(@Req() req: any) {
    try {
      const userId = req.user.id;
      return this.subjectsService.getWeeklyFocusDistribution(userId);
    } catch (e) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  @Get('weekly-mastery')
  async getWeeklyMastery(@Req() req: any) {
    try {
      const userId = req.user.id;
      return this.subjectsService.getWeeklyMastery(userId);
    } catch (e) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleStreakUpdate() {
    this.subjectsService.handleStreakUpdate();
  }

  @Post('updateCompletedTopics')
  async updateCompletedTopics(@Req() req: any, @Body() subjectData: any) {
    try {
      const userId = req.user.id;
      return this.subjectsService.updateCompletedTopics(userId, subjectData);
    } catch (e) {
      return {
        status: 500,
        message: 'Internal Server Error',
      };
    }
  }
}

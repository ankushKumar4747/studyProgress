import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Mongoose } from 'mongoose';
import { User } from 'src/auth/entities/user.entity';
import { Subject } from './entities/subject.entity';
import { StudyTime } from './entities/studtyTime.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    @InjectModel('Subject') private subjectModel: Model<Subject>,
    @InjectModel('studyTime') private studyTimeModel: Model<StudyTime>,
  ) {}

  async studyGoal(userId: mongoose.Types.ObjectId, min: number) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }
    user.studyMinutes = min;
    await user.save();
    return {
      status: 202,
      message: 'Study goal updated successfully',
    };
  }
  async getStudyGoal(userId: mongoose.Types.ObjectId) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return {
      minutes: user.studyMinutes,
    };
  }
  async getStreak(userId: mongoose.Types.ObjectId) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return {
      streak: user.streak,
    };
  }
  async getUserSubjects(userId: mongoose.Types.ObjectId) {
    const subjects = await this.subjectModel
      .find({ userId: userId as any })
      .exec();

    return {
      subjects: subjects.map((s) => {
        let completed = 0;
        let total = 0;

        s.chapters.forEach((chapter) => {
          chapter.subtopics.forEach((subtopic) => {
            total++;
            if (subtopic.isCompleted) {
              completed++;
            }
          });
        });

        return {
          id: s._id,
          name: s.subjectName,
          totalChapters: s.totalChapter,
          completed,
          incompleted: total - completed,
        };
      }),
    };
  }
  async getSubjectProgress(subjectId: string, userId: mongoose.Types.ObjectId) {
    const subject = await this.subjectModel
      .findOne({ _id: subjectId, userId: userId as any })
      .exec();

    if (!subject) {
      throw new Error('Subject not found');
    }

    // Calculate total topics and completed topics
    let totalTopics = 0;
    let completedTopics = 0;

    subject.chapters.forEach((chapter) => {
      chapter.subtopics.forEach((subtopic) => {
        totalTopics++;
        if (subtopic.isCompleted) {
          completedTopics++;
        }
      });
    });

    const completionPercentage =
      totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return {
      subjectName: subject.subjectName,
      totalTopics,
      completedTopics,
      remainingTopics: totalTopics - completedTopics,
      completionPercentage,
      totalChapters: subject.totalChapter,
    };
  }

  async totalSubjectsWithData(userId: mongoose.Types.ObjectId) {
    const subjects = await this.subjectModel
      .find({ userId: userId as any })
      .exec();

    return subjects;
  }

  async updateStudyTime(
    userId: mongoose.Types.ObjectId,
    studyTime: {
      min: number;
      subjectId: mongoose.Schema.Types.ObjectId;
    },
  ) {
    // current year + month + date in milliseconds
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMillis = today.getTime();

    await this.studyTimeModel.findOneAndUpdate(
      {
        subjectId: studyTime.subjectId,
        studyDate: todayMillis,
      },
      {
        $inc: { studyMinutes: studyTime.min },
        $setOnInsert: {
          userId,
          subjectId: studyTime.subjectId,
          studyDate: todayMillis,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    return {
      message: 'time is updated',
    };
  }

  async getTodayStudyTime(userId: any) {
    // current year + month + date (00:00) in ms
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMillis = today.getTime();

    const result = await this.studyTimeModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          studyDate: todayMillis,
        },
      },
      {
        $group: {
          _id: null,
          totalStudyMinutes: { $sum: '$studyMinutes' },
        },
      },
    ]);

    return {
      date: todayMillis,
      totalStudyMinutes: result[0]?.totalStudyMinutes || 0,
    };
  }

  async getWeeklyFocusDistribution(userId: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dayOfWeek = today.getDay(); // 0 is Sunday
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    const mondayMillis = monday.getTime();

    const endOfWeek = new Date(monday);
    endOfWeek.setDate(monday.getDate() + 7);
    const endOfWeekMillis = endOfWeek.getTime();

    const result = await this.studyTimeModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          studyDate: { $gte: mondayMillis, $lt: endOfWeekMillis },
        },
      },
      {
        $group: {
          _id: '$studyDate',
          totalMinutes: { $sum: '$studyMinutes' },
        },
      },
    ]);

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const distribution = weekDays.map((day, index) => {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + index);
      const currentDayMillis = currentDay.getTime();

      const found = result.find((r) => r._id === currentDayMillis);
      return {
        name: day,
        hours: found ? +(found.totalMinutes / 60).toFixed(1) : 0,
        goal: 5, // Default goal, could be dynamic
      };
    });

    return distribution;
  }

  async getWeeklyMastery(userId: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMillis = today.getTime();

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);
    const sevenDaysAgoMillis = sevenDaysAgo.getTime();

    // Aggregate study time for last 7 days grouped by subject
    const studyStats = await this.studyTimeModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          studyDate: { $gte: sevenDaysAgoMillis, $lte: todayMillis + 86400000 },
        },
      },
      {
        $group: {
          _id: '$subjectId',
          totalMinutes: { $sum: '$studyMinutes' },
        },
      },
    ]);

    const totalMinutesAllSubjects = studyStats.reduce(
      (acc, curr) => acc + curr.totalMinutes,
      0,
    );

    // Fetch details for each subject found
    const subjectsData = await Promise.all(
      studyStats.map(async (stat) => {
        const subject = await this.subjectModel.findById(stat._id).exec();
        if (!subject) return null;

        let totalTopics = 0;
        let completedTopics = 0;
        subject.chapters.forEach((chapter) => {
          chapter.subtopics.forEach((subtopic) => {
            totalTopics++;
            if (subtopic.isCompleted) completedTopics++;
          });
        });

        const percentage =
          totalTopics > 0
            ? Math.round((completedTopics / totalTopics) * 100)
            : 0;

        return {
          subjectName: subject.subjectName,
          hours: +(stat.totalMinutes / 60).toFixed(1),
          percent: percentage,
          // Color logic can be handled here or frontend.
          // Reusing frontend random assignment logic might be easier there
          // or we assign deterministically here?
          // Let's pass simplified data.
        };
      }),
    );

    return {
      totalHours: +(totalMinutesAllSubjects / 60).toFixed(1),
      subjects: subjectsData.filter((s) => s !== null),
    };
  }
}

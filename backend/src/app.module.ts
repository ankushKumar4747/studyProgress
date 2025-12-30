import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
// import { UserSchema } from './auth/entities/user.entity';
import { SubjectsModule } from './subjects/subjects.module';
import { AssignmentModule } from './assignment/assignment.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017/studyProgress'),
    SubjectsModule,
    AssignmentModule,
    JwtModule
    .register({
      global: true,
      secret: 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

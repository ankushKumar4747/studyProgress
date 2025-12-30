import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';

class SubtopicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional() // frontend may omit it
  isCompleted?: boolean;
}

class ChapterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  section: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SubtopicDto)
  subtopics: SubtopicDto[];
}

class SubjectDto {
  @IsString()
  @IsNotEmpty()
  subjectName: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ChapterDto)
  chapters: ChapterDto[];
}

export class CreateAssignmentDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SubjectDto)
  subjects: SubjectDto[];
}

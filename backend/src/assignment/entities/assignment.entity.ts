import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
// import { Schema } from "mongoose";
// import { Schema } from "mongoose";

export type AssignmentDocument = HydratedDocument<Assignment>;
@Schema({ timestamps: true })
export class Assignment {
    @Prop({type:[String]})
    subjects: string[];
    ref:"Subject"

}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
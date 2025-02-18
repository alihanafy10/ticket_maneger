import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

import {  TicketStatus, TicketType } from "../shared";


@Schema({ timestamps: true })
export class Ticket {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  })
  title: string;
  @Prop({
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  })
  description: string;
  @Prop({
    type: String,
    required: true,
    enum: Object.values(TicketStatus),
    default: TicketStatus.PENDING,
  })
  ticketStatus: string;

  @Prop({
    type: String,
    trim: true,
    enum:Object.values(TicketType),
    default:TicketType.NONE
  })
  ticketType: string;

  @Prop({
    type:String,
    unique: true,
  })
  ticketNumber:string;

  @Prop({
    type:mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  })
  userId: mongoose.Schema.Types.ObjectId;

}
const ticketSchema = SchemaFactory.createForClass(Ticket)



export const TicketModel=MongooseModule.forFeature([{name:Ticket.name,schema:ticketSchema}])
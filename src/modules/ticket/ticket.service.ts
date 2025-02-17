import { Injectable } from "@nestjs/common";
import { DateTime } from "luxon";
import { nanoid } from 'nanoid';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { TaddTicketBodyDto } from "../../common/types";
import { Ticket } from "../../common/schemas";
import { EmailService } from "../../services/email/email.service";

@Injectable()
export class TicketService {
    constructor(
        @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
 private readonly emailService: EmailService,){}

    async addTicket(req:Request|any,body:TaddTicketBodyDto){
        //fetch data from body
        const {title,description}=body
        //create ticketNum
        const ticketNumber=DateTime.now().toFormat("yyyy-MM-dd")+"/"+nanoid(5)
        //create new ticket obj
        const ticketObj=new this.ticketModel({
            title,
            description,
            ticketNumber,
            userId:req.authUser._id
        })
        //add ticket info to db
        const ticketData=await ticketObj.save()
        //send email to admin
        await this.emailService.sendEmailsTicket(
            req.authUser.email, 
            req.authUser.name, 
            title, 
            description, 
            ticketData.ticketStatus, 
            ticketData.ticketNumber, 
            ticketData.ticketType
          );
        
        //return data
        return ticketData
    }
}
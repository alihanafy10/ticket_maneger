import { Injectable, NotFoundException } from "@nestjs/common";
import { DateTime } from "luxon";
import { nanoid } from 'nanoid';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { TaddTicketBodyDto } from "../../common/types";
import { Ticket } from "../../common/schemas";
import { EmailService } from "../../services/email/email.service";
import { TicketType } from "../../common/shared";

@Injectable()
export class TicketService {
    constructor(
        @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
 private readonly emailService: EmailService,){}

 /**add a new Ticket
  * 
  * @param {Request|any}req 
  * @param {TaddTicketBodyDto}body 
  * 
  * @returns {Ticket}
  */
    async addTicket(req:Request|any,body:TaddTicketBodyDto):Promise<Ticket>{
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
            ticketData.ticketType as TicketType
          );
        
        //return data
        return ticketData
    }

    /**
     * 
     * @returns {Ticket[]}
     */
    async allTicketWithoutType():Promise<Ticket[]>{
        return await this.ticketModel.find({ticketType:"none"})
    }

    async updateTicketType(ticketType:string,ticketId:string){
        //check if ticket found
        const ticket:any|Ticket=await this.ticketModel.findOneAndUpdate({_id:ticketId,ticketType:TicketType.NONE}, { ticketType }, { new: true }).populate("userId")
        if(!ticket)throw new NotFoundException('ticket not found')
        //send email to admin
        await this.emailService.sendEmailsTicket(
            ticket.userId.email, 
            ticket.userId.name, 
            ticket.title, 
            ticket.description, 
            "open", 
            ticket.ticketNumber, 
            ticketType 
          );
        //return data
        return ticket
    }
}
import { Injectable, NotFoundException } from "@nestjs/common";
import { DateTime } from "luxon";
import { nanoid } from 'nanoid';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

import { TaddTicketBodyDto, TgetTicketQueryDto, TupdateTicketParamDto, TupdateTicketQueryDto } from "../../common/types";
import { Ticket, TicketHistory } from "../../common/schemas";
import { EmailService } from "../../services/email/email.service";
import { TicketStatus, TicketType } from "../../common/shared";

@Injectable()
export class TicketService {
    constructor(
        @InjectModel(Ticket.name) private ticketModel: Model<Ticket>,
        @InjectModel(TicketHistory.name) private ticketHistoryModel: Model<TicketHistory>,
        private readonly emailService: EmailService,
    ){}

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
        return await this.ticketModel.find({ticketType:TicketType.NONE})
    }

    /**
     * 
     * @param {TicketType} ticketType 
     * @param { string}ticketId 
     * 
     * @throws {NotFoundException} - ticket not found
     * 
     * @returns {Ticket}
     */
    async updateTicketType(ticketType:TicketType,ticketId:string):Promise<Ticket>{
        //check if ticket found
        const ticket:any|Ticket=await this.ticketModel.findOneAndUpdate({_id:ticketId,ticketType:TicketType.NONE}, { ticketType }, { new: true }).populate("userId")
        if(!ticket)throw new NotFoundException('ticket not found')
        //send email to admin
        await this.emailService.sendEmailsTicket(
            ticket.userId.email, 
            ticket.userId.name, 
            ticket.title, 
            ticket.description, 
            TicketStatus.PENDING, 
            ticket.ticketNumber, 
            ticketType 
          );
        //return data
        return ticket
    }

    /**
     * 
     * @returns {Ticket[]}
     */
    async allTicketWithType():Promise<Ticket[]> {
        return await this.ticketModel.find({ticketType:{$ne:TicketType.NONE},ticketStatus:{$ne:TicketStatus.CLOSED}})
    }

    /**
     * 
     * @param {Request}req 
     * @param {TupdateTicketQueryDto}query 
     * @param {TupdateTicketParamDto}param 
     * 
     * @throws {NotFoundException} - ticket not found
     * 
     * @returns {Ticket}
     */
    async updateTicket(req:Request|any,query:TupdateTicketQueryDto,param:TupdateTicketParamDto):Promise<Ticket> {
        //check if ticket found
        const ticket:Ticket|any=await this.ticketModel.findById(param._id).populate("userId");
        if(!ticket)throw new NotFoundException('ticket not found')

        //auth user
        const authUser=req.authUser
        //data of query
        const {result,ticketStatus}=query
        //update and add logs
        const logsObj:TicketHistory={changedBy:authUser._id,ticketId:ticket._id,changes:{}}
        if(result){
            logsObj.changes.result=result
            ticket.result=result
        }
        if(ticketStatus){
            logsObj.changes.ticketStatus=ticketStatus
            ticket.ticketStatus=ticketStatus
        }
        //saved data in database
        const ticketData:Ticket|any=await ticket.save()
        await new this.ticketHistoryModel(logsObj).save()
        //send email
         //send email to admin
         await this.emailService.sendEmailsTicket(
            ticket.userId.email, 
            ticket.userId.name, 
            ticket.title, 
            ticket.description, 
            ticketData.ticketStatus, 
            ticket.ticketNumber, 
            ticket.ticketType,
            ticketData.result 
          );
          //return data
        return ticketData
    }

    /**get all ticket hestory
     * 
     * @returns {TicketHistory[]}
     */
    async allTicketHestory():Promise<TicketHistory[]> {
        return await this.ticketHistoryModel.find()
    }

/**get specific ticket
 * 
 * @param {any}req 
 * @param {TgetTicketQueryDto}query 
 * 
 * @returns {Ticket}
 */
    async getSpecificTicket(req:any,query:TgetTicketQueryDto):Promise<Ticket>{
        return await this.ticketModel.findOne({userId:req.authUser._id,ticketNumber:query.ticketNumber})
    }

/**get all specific ticket
 * 
 * @param {any}req 
 * 
 * @returns {Ticket[]}
 */
    async getAllSpecificTicket(req:any):Promise<Ticket[]>{
        return await this.ticketModel.find({userId:req.authUser._id})
    }
}
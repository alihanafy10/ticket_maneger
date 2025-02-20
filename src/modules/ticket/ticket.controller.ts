import { Body, Controller, Get, Param, Post, Put, Query, Req, Res } from "@nestjs/common";

import { TicketService } from "./ticket.service";
import { UserRole } from "../../common/shared";
import { Auth } from "../../common/decorator";
import { ZodValidationPipe } from "../../common/pipes";
import { addTicketBodyDto, getTicketQueryDto, updateTicketParamDto, updateTicketQueryDto, updateTicketTypeParamDto, updateTicketTypeQueryDto } from "./dto";
import { TaddTicketBodyDto, TgetTicketQueryDto, TupdateTicketParamDto, TupdateTicketQueryDto, TupdateTicketTypeParamDto, TupdateTicketTypeQueryDto } from "../../common/types";
import { Request, Response } from "express";

@Controller('ticket')
export class TicketController {
    constructor(private readonly ticketService:TicketService){}

    @Post('add')
    @Auth([ UserRole.ADMIN, UserRole.CLASSIFIER, UserRole.MANAGER, UserRole.USER])
    async addTicket(
        @Req() req: Request,
        @Res() res: Response,
        @Body(new ZodValidationPipe(addTicketBodyDto)) body: TaddTicketBodyDto,
    ){
        const data = await this.ticketService.addTicket(req,body)
        res.status(201).json({message:"Ticket added successfully",data})
    }

    @Get('allTickets/NType')
    @Auth([ UserRole.CLASSIFIER,UserRole.MANAGER])
    async allTicketWithoutType(
        @Res() res: Response,
    ){
        const data = await this.ticketService.allTicketWithoutType()
        res.status(200).json({message:"success",data})
    }

    @Put('allTickets/NType/:_id')
    @Auth([ UserRole.CLASSIFIER,UserRole.MANAGER])
    async updateTicketType(
        @Res() res: Response,
        @Query(new ZodValidationPipe(updateTicketTypeQueryDto)) query:TupdateTicketTypeQueryDto ,
        @Param(new ZodValidationPipe(updateTicketTypeParamDto)) param:TupdateTicketTypeParamDto
    ){
        const data = await this.ticketService.updateTicketType(query.ticketType,param._id)
        res.status(200).json({message:"success",data})
    }

    @Get('allTickets/Type')
    @Auth([ UserRole.ADMIN,UserRole.MANAGER])
    async allTicketWithType(
        @Res() res: Response,
    ){
        const data = await this.ticketService.allTicketWithType()
        res.status(200).json({message:"success",data})
    }

    @Put("allTickets/Type/:_id")
    @Auth([ UserRole.ADMIN,UserRole.MANAGER])
    async updateTicket(
        @Res() res: Response,
        @Req() req: Request,
        @Query(new ZodValidationPipe(updateTicketQueryDto)) query:TupdateTicketQueryDto ,
        @Param(new ZodValidationPipe(updateTicketParamDto)) param:TupdateTicketParamDto
    ){
        const data = await this.ticketService.updateTicket(req, query, param)
        res.status(200).json({message:"success",data})
    }


    @Get('all-ticket-hestory')
    @Auth([UserRole.MANAGER])
    async allTicketHestory(
        @Res() res: Response,
    ){
        const data = await this.ticketService.allTicketHestory()
        res.status(200).json({message:"success",data})
    }

    @Get('specific-ticket')
    @Auth([ UserRole.ADMIN, UserRole.CLASSIFIER, UserRole.MANAGER, UserRole.USER])
    async getSpecificTicket(
        @Req() req: Request,
        @Res() res: Response,
        @Query(new ZodValidationPipe(getTicketQueryDto)) query:TgetTicketQueryDto
    ){
        const data = await this.ticketService.getSpecificTicket(req,query)
        res.status(200).json({message:"success",data})
    }

    @Get('all/specific-ticket')
    @Auth([ UserRole.ADMIN, UserRole.CLASSIFIER, UserRole.MANAGER, UserRole.USER])
    async getAllSpecificTicket(
        @Req() req: Request,
        @Res() res: Response,
    ){
        const data = await this.ticketService.getAllSpecificTicket(req)
        res.status(200).json({message:"success",data})
    }
}
import { Body, Controller, Get, Param, Post, Query, Req, Res } from "@nestjs/common";

import { TicketService } from "./ticket.service";
import { UserRole } from "../../common/shared";
import { Auth } from "../../common/decorator";
import { ZodValidationPipe } from "../../common/pipes";
import { addTicketBodyDto, updateTicketTypeParamDto, updateTicketTypeQueryDto } from "./dto";
import { TaddTicketBodyDto, TupdateTicketTypeParamDto, TupdateTicketTypeQueryDto } from "../../common/types";
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

    @Post('allTickets/NType/:_id')
    @Auth([ UserRole.CLASSIFIER,UserRole.MANAGER])
    async updateTicketType(
        @Res() res: Response,
        @Query(new ZodValidationPipe(updateTicketTypeQueryDto)) query:TupdateTicketTypeQueryDto ,
        @Param(new ZodValidationPipe(updateTicketTypeParamDto)) param:TupdateTicketTypeParamDto
    ){
        const data = await this.ticketService.updateTicketType(query.ticketType,param._id)
        res.status(200).json({message:"success",data})
    }
}
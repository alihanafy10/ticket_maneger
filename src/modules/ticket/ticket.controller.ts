import { Body, Controller, Post, Req, Res } from "@nestjs/common";

import { TicketService } from "./ticket.service";
import { UserRole } from "../../common/shared";
import { Auth } from "../../common/decorator";
import { ZodValidationPipe } from "../../common/pipes";
import { addTicketBodyDto } from "./dto";
import { TaddTicketBodyDto } from "../../common/types";
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
}
import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { TicketController } from "./ticket.controller";
import { TicketService } from "./ticket.service";
import { EmailModule } from "../../services/email/email.module";
import { TicketModel, UserModel } from "../../common/schemas";


@Module({
     imports: [EmailModule,UserModel,TicketModel],
      controllers: [TicketController],
      providers: [TicketService,JwtService],
})
export class TicketModule {}
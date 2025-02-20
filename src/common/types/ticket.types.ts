
import { addTicketBodyDto, getTicketQueryDto, updateTicketParamDto, updateTicketQueryDto, updateTicketTypeParamDto, updateTicketTypeQueryDto } from '../../modules/ticket/dto';
import { z } from 'zod';

export type TaddTicketBodyDto = z.infer<typeof addTicketBodyDto>;
export type TupdateTicketTypeQueryDto = z.infer<typeof updateTicketTypeQueryDto>;
export type TupdateTicketTypeParamDto = z.infer<typeof updateTicketTypeParamDto>;
export type TupdateTicketQueryDto = z.infer<typeof updateTicketQueryDto>;
export type TupdateTicketParamDto = z.infer<typeof updateTicketParamDto>;
export type TgetTicketQueryDto = z.infer<typeof getTicketQueryDto>;


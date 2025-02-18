
import { addTicketBodyDto, updateTicketTypeParamDto, updateTicketTypeQueryDto } from '../../modules/ticket/dto';
import { z } from 'zod';

export type TaddTicketBodyDto = z.infer<typeof addTicketBodyDto>;
export type TupdateTicketTypeQueryDto = z.infer<typeof updateTicketTypeQueryDto>;
export type TupdateTicketTypeParamDto = z.infer<typeof updateTicketTypeParamDto>;



import { addTicketBodyDto } from '../../modules/ticket/dto';
import { z } from 'zod';

export type TaddTicketBodyDto = z.infer<typeof addTicketBodyDto>;


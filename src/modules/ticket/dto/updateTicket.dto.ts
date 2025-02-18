import { z } from 'zod';

import { generalRules, TicketType } from '../../../common/shared';

//update ticket type query
export const updateTicketTypeQueryDto = z
  .object({
    ticketType: z.enum([
        TicketType.TECHNICAL,
        TicketType.DEVELOPER,
        TicketType.CUSTOMER_SERVICE
      ]),
  })
  .strict();

  
export const updateTicketTypeParamDto = z
  .object({
    _id:generalRules.IdesRole,
  })
  .strict();

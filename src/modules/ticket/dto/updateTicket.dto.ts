import { z } from 'zod';

import { generalRules, TicketStatus, TicketType } from '../../../common/shared';

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


  //update ticket query
export const updateTicketQueryDto = z
.object({
  ticketStatus: z.enum([
      TicketStatus.IN_PROGRESS,
      TicketStatus.CLOSED,
    ]).optional(),
    result:z.string().max(500).optional()
})
.strict();

export const updateTicketParamDto=updateTicketTypeParamDto
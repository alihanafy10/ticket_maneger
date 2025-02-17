import { z } from 'zod';

//add ticket body
export const addTicketBodyDto = z
  .object({
    title: z.string().max(100),
    description: z.string().max(500),
  })
  .strict();


import { z } from "zod";

// get ticket query parameters
export const getTicketQueryDto = z
.object({
    ticketNumber:z.string()
})
.strict();
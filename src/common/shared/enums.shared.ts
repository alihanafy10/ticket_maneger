export enum UserRole{
    USER = 'user',
    ADMIN = 'admin',
    MANAGER="manager",
    CLASSIFIER='classifier'
}


export enum UserProviderType { 
    SYSTEM = 'system',
    GOOGLE = 'google'//todo,
}

export enum TicketStatus {
    PENDING = 'pending',
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    CLOSED = 'closed'
}

export enum TicketType {
    TECHNICAL='technical',
    DEVELOPER = 'developer',
    CUSTOMER_SERVICE= 'customer_service',
    NONE='none'
}


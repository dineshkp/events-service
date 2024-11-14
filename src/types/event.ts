export interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export type CreateEventDTO = Omit<Event, 'id' | 'created_at' | 'updated_at'>;
export type UpdateEventDTO = Partial<CreateEventDTO>;
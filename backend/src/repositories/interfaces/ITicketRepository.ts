import { CreateTicketData, TicketDTO, UpdateTicketData } from '../../types/domain';

export interface ITicketRepository {
  findAll(): Promise<TicketDTO[]>;
  findById(id: number): Promise<TicketDTO | null>;
  create(data: CreateTicketData): Promise<TicketDTO>;
  update(id: number, data: UpdateTicketData): Promise<TicketDTO | null>;
  delete(id: number): Promise<boolean>;
}

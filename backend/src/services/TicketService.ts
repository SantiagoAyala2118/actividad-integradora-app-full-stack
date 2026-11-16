import { NotFoundError } from '../errors/AppError';
import { ISubject } from '../observer/ISubject';
import { ITicketRepository } from '../repositories/interfaces/ITicketRepository';
import { CreateTicketData, TicketDTO, TicketStatus, TicketStatusChangedEvent } from '../types/domain';

export class TicketService {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly publisher: ISubject<TicketStatusChangedEvent>,
  ) {}

  list(): Promise<TicketDTO[]> {
    return this.ticketRepository.findAll();
  }

  async getById(id: number): Promise<TicketDTO> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) throw new NotFoundError('Ticket no encontrado');
    return ticket;
  }

  create(data: CreateTicketData): Promise<TicketDTO> {
    return this.ticketRepository.create(data);
  }

  async update(id: number, data: Partial<CreateTicketData>): Promise<TicketDTO> {
    const ticket = await this.ticketRepository.update(id, data);
    if (!ticket) throw new NotFoundError('Ticket no encontrado');
    return ticket;
  }

  /** Cambia el estado y, si realmente cambió, avisa a los observers. */
  async changeStatus(id: number, newStatus: TicketStatus): Promise<TicketDTO> {
    const current = await this.getById(id);
    if (current.status === newStatus) return current;

    const updated = await this.ticketRepository.update(id, { status: newStatus });
    if (!updated) throw new NotFoundError('Ticket no encontrado');

    await this.publisher.notify({
      ticketId: updated.id,
      ticketTitle: updated.title,
      previousStatus: current.status,
      newStatus: updated.status,
      changedAt: updated.updatedAt,
    });

    return updated;
  }

  async delete(id: number): Promise<void> {
    const deleted = await this.ticketRepository.delete(id);
    if (!deleted) throw new NotFoundError('Ticket no encontrado');
  }
}

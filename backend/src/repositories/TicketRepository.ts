import { TicketModel } from '../models';
import { CreateTicketData, TicketDTO, UpdateTicketData } from '../types/domain';
import { ITicketRepository } from './interfaces/ITicketRepository';

export class TicketRepository implements ITicketRepository {
  async findAll(): Promise<TicketDTO[]> {
    const tickets = await TicketModel.findAll({ order: [['id', 'DESC']] });
    return tickets.map((t) => this.toDTO(t));
  }

  async findById(id: number): Promise<TicketDTO | null> {
    const ticket = await TicketModel.findByPk(id);
    return ticket ? this.toDTO(ticket) : null;
  }

  async create(data: CreateTicketData): Promise<TicketDTO> {
    const ticket = await TicketModel.create(data);
    return this.toDTO(ticket);
  }

  async update(id: number, data: UpdateTicketData): Promise<TicketDTO | null> {
    const ticket = await TicketModel.findByPk(id);
    if (!ticket) return null;
    await ticket.update(data);
    return this.toDTO(ticket);
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await TicketModel.destroy({ where: { id } });
    return deleted > 0;
  }

  private toDTO(ticket: TicketModel): TicketDTO {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };
  }
}

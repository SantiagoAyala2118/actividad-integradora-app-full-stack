import { Request, Response } from 'express';
import { BadRequestError } from '../errors/AppError';
import { TicketService } from '../services/TicketService';
import { isTicketStatus, TICKET_STATUSES } from '../types/domain';
import { getField, optionalString, parseId, requireString } from './validation';

export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    res.json(await this.ticketService.list());
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.ticketService.getById(parseId(req.params.id)));
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const title = requireString(req.body, 'title', 150);
    const description = optionalString(req.body, 'description', 2000) ?? '';
    res.status(201).json(await this.ticketService.create({ title, description }));
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req.params.id);
    const title = optionalString(req.body, 'title', 150);
    const description = optionalString(req.body, 'description', 2000);
    if (title === undefined && description === undefined) {
      throw new BadRequestError('Enviá al menos "title" o "description"');
    }
    res.json(await this.ticketService.update(id, { title, description }));
  };

  changeStatus = async (req: Request, res: Response): Promise<void> => {
    const id = parseId(req.params.id);
    const status = getField(req.body, 'status');
    if (!isTicketStatus(status)) {
      throw new BadRequestError(`"status" debe ser uno de: ${TICKET_STATUSES.join(', ')}`);
    }
    res.json(await this.ticketService.changeStatus(id, status));
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.ticketService.delete(parseId(req.params.id));
    res.status(204).end();
  };
}

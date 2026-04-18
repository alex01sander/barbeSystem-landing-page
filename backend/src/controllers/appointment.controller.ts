import { Request, Response } from "express";
import { AppointmentService } from "../services/appointment.service";
import { AppointmentStatus } from "../utils/types";

const appointmentService = new AppointmentService();

export class AppointmentController {
  async index(req: Request, res: Response) {
    try {
      const { barberId, clientId, date, startDate, endDate } = req.query;
      
      const appointments = await appointmentService.list({
        barberId: barberId as string,
        clientId: clientId as string,
        date: date as string,
        startDate: startDate as string,
        endDate: endDate as string
      });

      return res.json(appointments);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao listar agendamentos";
      return res.status(500).json({ error: message });
    }
  }

  async store(req: Request, res: Response) {
    try {
      const appointment = await appointmentService.create(req.body);
      return res.status(201).json(appointment);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao criar agendamento";
      return res.status(400).json({ error: message });
    }
  }

  async getAvailableSlots(req: Request, res: Response) {
    try {
      const { barberId, serviceId, date } = req.query;
      
      if (!barberId || !serviceId || !date) {
        return res.status(400).json({ error: "Parâmetros barberId, serviceId e date são obrigatórios" });
      }

      const slots = await appointmentService.getAvailableSlots(
        barberId as string,
        serviceId as string,
        date as string
      );

      return res.json(slots);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao buscar horários disponíveis";
      return res.status(500).json({ error: message });
    }
  }

  async createPublic(req: Request, res: Response) {
    try {
      const appointment = await appointmentService.createPublicAppointment(req.body);
      return res.status(201).json(appointment);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao criar agendamento público";
      return res.status(400).json({ error: message });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Novo status é obrigatório" });
      }

      const appointment = await appointmentService.updateStatus(id, status as AppointmentStatus);
      return res.json(appointment);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar status";
      return res.status(400).json({ error: message });
    }
  }
}

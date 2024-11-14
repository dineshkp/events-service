import { Request, Response } from 'express';
import { db } from '../db/sqlite';
import { CreateEventDTO, UpdateEventDTO } from '../types/event';

export const getAllEvents = async (req: Request, res: Response) => {
    db.all('SELECT * FROM events ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch events' });
        }
        res.json(rows);
    });
};

export const createEvent = async (req: Request, res: Response) => {
    const event: CreateEventDTO = req.body;
    const id = crypto.randomUUID();

    const query = `
    INSERT INTO events (id, title, date, location, description)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.run(
        query,
        [id, event.title, event.date, event.location, event.description],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to create event' });
            }

            res.status(201).json({
                id,
                ...event,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
        }
    );
};

export const getEventById = async (req: Request, res: Response) => {
    const { id } = req.params;

    db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch event' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(row);
    });
};

export const updateEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates: UpdateEventDTO = req.body;

    const setClause = Object.keys(updates)
        .map(key => `${key} = ?`)
        .join(', ');

    const query = `
    UPDATE events 
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

    db.run(
        query,
        [...Object.values(updates), id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to update event' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.json({ message: 'Event updated successfully' });
        }
    );
};

export const deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params;

    db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete event' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    });
};
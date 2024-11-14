import { Router } from 'express';
import * as eventController from '../../controllers/events';

const router = Router();

router.get('/', eventController.getAllEvents);
router.post('/', eventController.createEvent);
router.get('/:id', eventController.getEventById);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

export default router;
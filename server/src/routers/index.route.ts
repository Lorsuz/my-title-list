import { formForContactWithEmail } from '../controllers/index.controller.js';
import { router, Request, Response } from '../config/router.config.js';
import { response } from 'express';

router.get('/', (req: Request, res: Response) => {
	res.send('API is running here! go to /api/users/all to see the users');
});

router.post('/form/contact', formForContactWithEmail);

export default router;

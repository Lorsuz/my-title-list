import { formForContactWithEmail, formForParadeWithUs } from '../controllers/index.controller.js';
import { router, Request, Response } from '../config/router.config.js';

router.get('/', (req: Request, res: Response) => {
	res.send('API is running here! got to /api/users/all to see the users');
});

router.post('/form/contact', formForContactWithEmail);
router.get('/form/parade-with-us', formForParadeWithUs);

export default router;

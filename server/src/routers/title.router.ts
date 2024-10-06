import * as titleController from '../controllers/title.controller.js';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware.js';
import { router } from '../config/router.config.js';

router.route( '/' )
	.get( titleController.getTitles )
	.post( isAuthenticated, titleController.createTitle )
	.put( isAuthenticated, titleController.updateTitle )
	.delete( isAuthenticated, titleController.deleteTitle );
export default router;
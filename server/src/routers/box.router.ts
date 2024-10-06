import * as boxController from '../controllers/box.controller.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';
import { router } from '../config/router.config.js';

router.route( '/' )
	.get( boxController.getBoxes )
	.post( isAuthenticated, boxController.createBox )
	.put( isAuthenticated, boxController.updateBox )
	.delete( isAuthenticated, boxController.deleteBox );
export default router
import * as gradeController from '../controllers/grade.controller.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';
import { router } from '../config/router.config.js';

router.route( '/import' ).post( gradeController.importCategories );
router.route( '/' )
	.get( gradeController.getCategories )
	.post( isAuthenticated, gradeController.createCategory )
	.put( isAuthenticated, gradeController.updateCategories )
	.delete( isAuthenticated, gradeController.deleteCategories );
export default router;
import * as CategoryController from '../controllers/category.controller.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';
import { router } from '../config/router.config.js';

router.route( '/import' ).post( CategoryController.importCategories );

router.route( '/' )
	.get( CategoryController.getCategories )
	.post( isAuthenticated, CategoryController.createCategory )
	.put( isAuthenticated, CategoryController.updateCategories )
	.delete( isAuthenticated, CategoryController.deleteCategories );


router.route( '/:id' )
	.put( isAuthenticated, CategoryController.updateCategory )
	.delete( isAuthenticated, CategoryController.deleteCategory );

export default router;
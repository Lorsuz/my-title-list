import * as UserController from '../controllers/user.controller.js';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware.js';
import { router } from '../config/router.config.js';

router.post( '/import-all', UserController.importUsers );

router.route( '/' )
	.get( isAuthenticated, isAdmin, UserController.getAllUsers )
	.put( isAuthenticated, UserController.updateProfile )
	.delete( isAuthenticated, UserController.deleteUser );

router.get( '/verify-token', UserController.verifyToken );

router.post( '/register', UserController.register );
router.post( '/login', UserController.login );

router.put( '/change-password', isAuthenticated, UserController.changePassword );

TODO: router.get('/:nickname', UserController.getByNickname);

export default router;

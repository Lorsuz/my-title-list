import { jwt, Request, Response, NextFunction, secretKey, pool } from '../config/router.config.js';
import User from '../models/user.model.js';
import expressAsyncHandler from 'express-async-handler';

export const generateToken = ( id: number | string ) => jwt.sign( { id }, secretKey, { expiresIn: '1d' } );

export const isAuthenticated = expressAsyncHandler( async ( req: Request & any, res: Response, next: NextFunction ) => {
	try {
		let token: string = '';
		const authHeader = req.headers.authorization;
		if ( authHeader && authHeader.startsWith( 'Bearer' ) ) {
			token = req.headers.Authorization.split( ' ' )[ 1 ];
		} else {
			throw new Error( 'Faça login para acessar esta página' );
		}

		const decoded: any = await new Promise( ( resolve, reject ) => {
			jwt.verify( token, secretKey, ( err, decoded ) => {
				if ( err ) reject( err );
				else resolve( decoded );
			} );
		} );

		if ( decoded.id ) {
			const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);

			if ( users.length > 0 ) {
				const user = users[0];
				if ( user.verified === 0 ) {
					console.error( 'Usuário não verificado:', user );
					throw new Error( 'Usuário não verificado' );
				}
				delete user.password;
				delete user.verified;
				delete user.updatedAt;
				req.user = user;
				next();
			} else {
				console.error( 'Nenhum usuário encontrado com este ID:', decoded.id );
				throw new Error( 'Nenhum usuário encontrado com este token' );
			}
		} else {
			console.error( 'ID não encontrado no token decodificado:', decoded );
			throw new Error( 'Nenhum ID encontrado no token decodificado' );
		}

	} catch ( err ) {
		next( err );
	}
} );

interface UserRequest extends Request {
	user?: {
		isAdmin: boolean;
	};
}

export const isAdmin = ( req: UserRequest, res: Response, next: NextFunction ) => {
	try {
		if ( req.user && req.user.isAdmin )
			next();
		else
			res.status( 403 ).json( { message: 'Acesso negado: você não é administrador.' } );

	} catch ( err ) {
		next( err );
	}
};
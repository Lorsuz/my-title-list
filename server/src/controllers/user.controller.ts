import OrderModel from '../models/order.model.js';
import UserModel from '../models/user.model.js';
import expressAsyncHandler from 'express-async-handler';
import { crypto, pool, bcrypt, zod } from '../config/router.config.js';
import { generateProfileImageUrl, getFirstAndLastName } from '../utils/stringOperations.js';
import { generateToken } from '../middlewares/auth.middleware.js';
import { users } from '../exports/preDatabase.js';
import { verifyEmail } from '../services/email.service.js';
import { authSchema } from '../schemas/auth.schema.js';
import { sendEmailFromFormContact } from '../services/email.service.js';



// #region import users
/**
 *	@desc			auth user & get token
 *	@route		POST /api/users/import-all
 *	@access		public
 **/

export const importUsers = expressAsyncHandler( async ( req, res, next ) => {
	try {
		await pool.execute( 'DELETE * FROM users' );
		await pool.execute( 'DELETE * FROM tokens' );
		let createdUsers: any[] = [];
		users.forEach( async ( user ) => {
			user.password = bcrypt.hashSync( user.password, 10 );
			user.profileImage = generateProfileImageUrl( user.fullName );
			const hashedPassword = bcrypt.hashSync( user.password, 10 );
			const createdUser = await pool.execute(
				'INSERT INTO users (fullName, email, password, profileImage, phone) VALUES (?, ?, ?, ?, ?)',
				[ user.fullName, user.email, hashedPassword, user.profileImage, user.phone ]
			);
			createdUsers.push( createdUser );
		} );
		res.status( 201 ).send( createdUsers );
	} catch ( error ) {
		next( error );
	}
} );

// #endregion

// #region login

/**
 *	@desc			auth user & get token
 *	@route		POST /api/users/login
 *	@access		public
 **/

export const login = expressAsyncHandler( async ( req, res, next ) => {
	try {
		const { email, password } = req.body;
		if ( !email || !password ) {
			throw new Error( 'Email e senha são obrigatórios' );
		}
		const [ users ]: any = await pool.execute( 'SELECT * FROM users WHERE email = ?', [ email ] );

		if ( users.length > 0 ) {
			const user = users[ 0 ];
			if ( user.verified ) {
				if ( bcrypt.compareSync( password, user.password ) ) {
					res.json( {
						_id: user._id,
						name: getFirstAndLastName( user.fullName ),
						email: user.email,
						phone: user.phone,
						profileImage: user.profileImage,
						isAdmin: user.isAdmin,
						token: generateToken( user._id.toString() )
					} );
				} else {
					throw new Error( 'Senha inválida' );
				}
			} else {
				throw new Error( 'Usuário não verificado' );
			}
		} else {
			throw new Error( 'Email não cadastrado' );
		}
	} catch ( error ) {
		console.error( error );

	}
} );

// #endregion

// #region register

/** 
 *	@desc			auth user & get token
 *	@route		POST /api/users/register
 *	@access		public
 **/

export const register = expressAsyncHandler( async ( req, res, next ) => {
	const { fullName, email, password, phone } = req.body;

	// const { email, password } = authSchema.parse( req.body );

	try {
		const [ existingUsers ]: any = await pool.execute( 'SELECT * FROM users WHERE email = ?', [ email ] );
		if ( existingUsers.length > 0 ) {
			res.status( 400 );
			throw new Error( 'Email already exists' );
		}
		const profileImage = generateProfileImageUrl( fullName );
		// ! Lembrar de validar nome, nick, email e telefone antes de inserir no banco de dados ZOD
		const hashedPassword = bcrypt.hashSync( password, 10 );
		const nickname: string[] | null = email.match( /^(.+)@/ );
		const [ result ]: any = await pool.execute(
			'INSERT INTO users (fullName, nickname, email, password, profileImage, phone) VALUES (?, ?, ?, ?, ?)',
			[ fullName, nickname, email, hashedPassword, profileImage, phone ]
		);
		const userId = result.insertId;
		const token = crypto.randomBytes( 16 ).toString( 'hex' );
		await pool.execute( 'INSERT INTO tokens (user_id, token) VALUES (?, ?)', [ userId, token ] );
		const url = `${ process.env.API_URL }/users/verify-token?token=${ token }`;
		await verifyEmail( email, url );
		res.status( 201 ).json( {
			message: 'Verifique seu email'
		} );
	} catch ( error ) {
		console.error( error );
	}
} );
// #endregion

// #region verify token
/**
 *	@desc			auth user & get token
 *	@route		POST /api/users/login
 *	@access		public
 **/

export const verifyToken = expressAsyncHandler( async ( req, res, next ) => {
	try {
		const [ tokens ]: any = await pool.execute( 'SELECT * FROM tokens WHERE token = ?', [ req.query.token ] );
		if ( tokens.length > 0 ) {
			const token = tokens[ 0 ];
			const [ updateResult ] = await pool.execute( 'UPDATE users SET verified = ? WHERE _id = ?', [ true, token.user_id ] );
			if ( updateResult.affectedRows > 0 ) {
				console.log( 'Usuário verificado com sucesso, buscando informações do usuário...' );
				const [ rows ] = await pool.execute( 'SELECT email FROM users WHERE _id = ?', [ token.user_id ] );
				if ( rows.length > 0 ) {
					const user = rows[ 0 ];
					console.log( 'Verificando valor de user em verify login:', user );
					await sendEmailFromFormContact( user.email );
				} else {
					console.error( 'Nenhum usuário encontrado com esse ID após o UPDATE' );
				}
			} else {
				console.error( 'Nenhuma linha foi atualizada' );
			}
			await pool.execute( 'DELETE FROM tokens WHERE user_id = ?', [ token.user_id ] );
			res.status( 200 ).json( { message: 'Email verified successfully' } );
		} else {
			res.status( 400 ).json( { message: 'Invalid token' } );
		}
	} catch ( error ) {
		next( error );
	}
} );

// #endregion

// #region update profile

/**
 *	@desc			auth user & get token
 *	@route		POST /api/users/login
 *	@access		private
 **/

export const updateProfile = expressAsyncHandler( async ( req: any, res, next ) => {
	try {
		const user: any = await UserModel.findById( req.user._id );
		if ( user ) {
			user.fullName = req.body.fullName || user.fullName;
			user.email = req.body.email || user.email;
			user.phone = req.body.phone || user.phone;
			user.image = req.body.image || user.image;
			// if(req.body.password){
			// 	user.password = bcrypt.hashSync(req.body.password, 10)
			// }
			const updatedUser = await user.save();
			res.json( {
				_id: updatedUser._id,
				name: updatedUser.fullName,
				email: updatedUser.email,
				phone: updatedUser.phone,
				image: updatedUser.image,
				isAdmin: updatedUser.isAdmin,
				token: generateToken( updatedUser._id )
			} );
		} else {
			res.status( 404 );
			throw new Error( 'User not found' );
		}
	} catch ( error ) {
		next( error );
	}
} );

// #endregion

// #region change password

/**
 *	@desc			auth user & get token
 *	@route		POST /api/users/login
 *	@access		private
 **/

export const changePassword = expressAsyncHandler( async ( req: any, res, next ) => {
	try {
		const { oldPassword, newPassword } = req.body;
		const user: any = await UserModel.findById( req.user._id );
		if ( user ) {
			if ( bcrypt.compareSync( oldPassword, user.password ) ) {
				user.password = bcrypt.hashSync( newPassword, 10 );
				await user.save();
				res.json( { message: 'Password changed successfully' } );
			} else {
				res.status( 401 );
				throw new Error( 'Invalid old password' );
			}
		} else {
			res.status( 404 );
			throw new Error( 'User not found' );
		}
	} catch ( error ) {
		next( error );
	}
} );

// #endregion

// #region delete user

/**
 * @desc Delete user
 * @route DELETE /api/users/users
 * @access private
 **/

export const deleteUser = expressAsyncHandler( async ( req: any, res, next ) => {
	try {
		const user: any = await UserModel.findByIdAndDelete( req.user._id );
		if ( user ) {
			await OrderModel.deleteMany( { user: user._id } );
			res.json( { message: 'User removed' } );
		} else {
			res.status( 404 );
			throw new Error( 'User not found' );
		}
	} catch ( error ) {
		next( error );
	}
} );

// #endregion

// #region get all users

/**
 *	@desc			auth user & get token
 *	@route		POST /api/users/login
 *	@access		public
 **/

export const getAllUsers = expressAsyncHandler( async ( req, res, next ) => {
	try {
		const users = await UserModel.find( {} );
		res.json( users );
	} catch ( error ) {
		next( error );
	}
} );

// #endregion

// #region log out

/**
 *	@desc			auth user & get token
 *	@route		POST /api/users/login
 *	@access		private
 **/

export const logOut = expressAsyncHandler( async ( req, res, next ) => {
	try {
		res.clearCookie( 'jwt' );
		res.status( 200 ).json( { message: 'Sessão encerrada com sucesso!' } );
	} catch ( error ) {
		next( error );
	}
} );

// #endregion

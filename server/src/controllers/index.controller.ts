import expressAsyncHandler from 'express-async-handler';

import { sendEmailFromFormContact } from '../services/email.service.js';

export const formForContactWithEmail = expressAsyncHandler( async ( req, res, next ) => {
	const data = req.body;
	console.log( data );
	try {
		await sendEmailFromFormContact( data ) ? res.json( { status: '200' } ) : res.json( { status: '401' } );
	} catch ( error ) {
		next( error );
	}
} )



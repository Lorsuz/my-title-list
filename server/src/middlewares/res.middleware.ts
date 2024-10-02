import { Request, Response, NextFunction } from 'express';

export const errorHandler = ( err: any, req: Request, res: Response, next: NextFunction ) => {
	const message = err.message || 'Ocorreu um erro interno';
	console.error( ':_: ->', err );
	res.status( err.status || 500 ).json( { message, stack: process.env.NODE_ENV === 'production' ? null : err.stack } );
};

export const finallyHandler = ( req: Request, res: Response, next: NextFunction ) => {
	console.log( `===== Request for ${ req.path } finished! =====` );
}


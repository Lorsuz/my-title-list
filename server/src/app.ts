import createError from 'http-errors';
import express, { Application, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/res.middleware.js';
// import morgan from 'morgan'


dotenv.config();

import indexRouter from './routers/index.router.js';
import userRouter from './routers/user.router.js';
import boxRouter from './routers/box.router.js';
import gradeRouter from './routers/grade.router.js';
import titleRouter from './routers/title.router.js';
import categoryRouter from './routers/category.router.js';

const app: Application = express();

app.use( bodyParser.json() );
app.use( cookieParser() );
app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );
app.use( logger( 'dev' ) );

app.get( '/', ( _, res, next ) => {
	try {
		res.end( 'API is running here!' );
	} catch ( error ) {
		next( error );
	}
}
);

app.use( '/api', indexRouter );
app.use( '/api/user', userRouter );
app.use( '/api/title', titleRouter );

app.use( errorHandler );

app.use( ( req: Request, res: Response, next: NextFunction ) => {
	next( createError( 404 ) );
} );

app.use( ( err: { message: string; status: number; }, req: Request, res: Response ) => {
	res.locals.message = err.message;

	res.locals.error = req.app.get( 'env' ) === 'development' ? err : {};

	res.status( err.status || 500 );
	res.render( 'error' );
} );

export default app;

/*
 ? sadadd
 ! sdaadsdasd
 // asdasddasdsd
 * sdaasdad
 TODO: sdsddsds
 */
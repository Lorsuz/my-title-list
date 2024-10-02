import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

let pool: any;
try {
	pool = mysql.createPool( {
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'my_title_list',
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0
	} );
	console.log( 'Servidor iniciado com sucesso!' );

} catch ( error ) {
	console.error( error );
	process.exit( 1 );
}

export default pool;

/*
 const connection = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	});
*/	
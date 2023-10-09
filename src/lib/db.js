import mysql from "mysql2/promise";

export async function query ({ query, values = [] }) {
	const dbconnection = await mysql.createConnection({
		host: process.env.SQL_HOST,
		database: process.env.SQL_DATABASE,
		user: process.env.SQL_ID,
		password: process.env.SQL_PASSWORD,
	});

	try {
		const [results] = await dbconnection.execute(query, values);
		dbconnection.end();
		return results;
	} catch (error) {
		throw Error(error.message);
		return { error };
	}
}
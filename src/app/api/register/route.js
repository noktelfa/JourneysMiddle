import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export async function POST(request) {
	const res = await request.json();

	const firstName = res.firstname;
	const lastName = res.lastname;
	const username = res.username;
	const email = res.email;
  const password = res.password;

  let salt = genSaltSync(10);
	let passHash = hashSync(password, salt);

	try {
		const userSQL = `INSERT INTO users (FirstName, LastName, Username, Email, Password) VALUES ("${firstName}", "${lastName}", "${username}", "${email}", "${passHash}")`;
		const valueParams = [];
		const createdUser = await query({ query: userSQL, values: [valueParams] });

    return NextResponse.json({ success: true });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ success: false });
	}
}

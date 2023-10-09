import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const email = searchParams.get('email');

	try {
		const userSQL = `SELECT UserId, FirstName, LastName, Motto, Email, Theme, Admin, Deleted FROM users WHERE Email="${email}"`;
		const valueParams = [];

		let user = await query({ query: userSQL, values: [valueParams] });
		if(user) {
			user = user[0];
			const userData = {
				userid: user.UserId,
				firstname: user.FirstName,
				lastname: user.LastName,
				username: user.Username,
				motto: user.Motto,
				theme: user.Theme,
				admin: user.Admin,
				deleted: user.Deleted,
			}
			return NextResponse.json({ user: userData });
		} else {
			return NextResponse.json({ problem: 'User not found'})
		};
	} catch (error) {
		return NextResponse.json({ problem: error });
	}
}

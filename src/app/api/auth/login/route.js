import { query } from '../../../../lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { compareSync } from 'bcrypt';

export async function POST(request) {
	const res = await request.json();
	const session = await getServerSession(res);
	try {
		const loginSQL = `SELECT UserId, Password, FirstName, LastName, Email, Theme, Admin, Deleted FROM users WHERE Username="${res.username}"`;
		const valueParams = [];
		let user = await query({ query: loginSQL});
		user = user[0];

		if(compareSync(res.password, user.Password)) {
			return NextResponse.json({
				userid: user.UserId,
				firstname: user.FirstName,
				lastname: user.LastName,
				email: user.Email,
				theme: user.Theme,
				admin: user.Admin,
				deleted: user.Deleted,
				source: 'TJM',
			});
		} else {
			return NextResponse.json({ response: 'nogo'}, { status: 401});
		}
	} catch(error) {
		return NextResponse.json({ problem: error });
	}
}

import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
	const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
		const querySQL = searchParams.get('username')
			? `SELECT UserId FROM users WHERE Username='${searchParams.get(
					'username'
			  )}'`
			: `SELECT UserId FROM users WHERE Email='${searchParams.get(
					'email'
			  )}'`;
		const valueParams = [];
		const foundUser = await query({
			query: querySQL,
			values: [valueParams],
		});

    if (foundUser.length === 0) {
			return NextResponse.json({ available: true });
		} else {
			return NextResponse.json({ available: false });
		}
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
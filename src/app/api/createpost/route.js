import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
	const res = await request.json();

	const message = res.postText;
	const id = res.id;
	const title = res.title;

	try {
		const userSQL = `INSERT INTO posts (UserId, PostTitle, PostBody) VALUES (${id}, '${title}', '${message}')`;
		const valueParams = [];
		const createdMessage = await query({
			query: userSQL,
			values: [valueParams],
		});

		return NextResponse.json({ created: true });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ created: false });
	}
}

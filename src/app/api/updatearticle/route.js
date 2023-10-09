import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
	const res = await request.json();

	const message = res.content;
	const id = res.id;
	const title = res.title;

	try {
		const updateSQL = `UPDATE posts set PostTitle="${title}", PostBody="${message}", Encrypted=1 WHERE PostId=${id}`;
		const valueParams = [];
		const updatedMessage = await query({
			query: updateSQL,
			values: [valueParams],
		});
		return NextResponse.json({ updated: true });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ updated: false });
	}
}

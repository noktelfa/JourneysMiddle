import { NextResponse } from 'next/server';

export async function POST(request) {
	const res = await request.json();
	const testid = res.number;

	if (testid === '12345678') {
		return NextResponse.json({
			success: 'Failure: User already registered on another account',
		});
	} else if (testid === '98765432') {
		return NextResponse.json({
			success: 'User deregistered with the old account. Good job.',
		});
	} else {
		return NextResponse.json({
			success: 'Inching closer to the dark side, you are!',
		});
	}
}

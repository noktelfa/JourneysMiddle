import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { compileComments } from '../../../lib/conversions';

export async function POST(request) {

	const session = await getServerSession(request);

  try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SITE_URL}/api/finduserbyemail?email=${session.user.email}`
		);
		let userData = await res.json();
		userData = userData.user;
		if (userData == null) {
		} else {
			session.userid = userData.userid;
			session.admin = userData.admin;
			session.deleted = userData.deleted;
			session.isRegistered = true;
		}

		const req = await request.json();
		const articleid = req.articleid;
		const comment = req.comment;
		const commenter = session.userid;

		const commentSQL = `INSERT INTO comments (PostId, UserId, Comment) values (${articleid}, ${commenter}, "${comment}")`;
		const valueParams = [];
		const commentSaved = await query({
			query: commentSQL,
			values: [valueParams],
		});

    const newCommentSQL = `SELECT CommentId, UserId, PostId, Comment FROM comments WHERE PostId=${articleid} AND Deleted=0 ORDER BY CommentId DESC`;
		const usersSQL = `SELECT FirstName, LastName, UserId FROM users WHERE Deleted=0`;
		let rawComments = await query({ query: newCommentSQL, values: [valueParams] });
		let rawUsers = await query({ query: usersSQL, values: [valueParams] });
    const comments = compileComments(rawComments, rawUsers);

		return NextResponse.json({ comments: comments});
	} catch(error) {
    console.log(error)
		return NextResponse.json({ likes: 'none' });
  }
}
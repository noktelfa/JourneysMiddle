import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
	try {
		const userSql = 
		'SELECT UserId, FirstName, LastName, Deleted from users';
		const postSql =
		'SELECT PostId, PostTitle, PostBody, UserId, Encrypted FROM posts WHERE Deleted=0 ORDER BY Pinned DESC, PostId DESC';
		const valueParams = [];
		const userList  = await query({ query: userSql, values: [valueParams] });
		const posts = await query({ query: postSql, values: [valueParams] });
		
		const users = new Map();
		const deleted = [];
		userList.forEach((user) =>
			users.set(user.UserId, user.FirstName + ' ' + user.LastName)
		);
		userList.forEach((user) => {
			if(user.Deleted) {
				deleted.push(user.UserId)
			}
		});
		
		const id = 1;
		const admin = true;
		
		const allPosts = posts
			.filter((post) => !deleted.includes(post.UserId))
			.map((post) => ({
				name: users.get(post.UserId),
				title: post.PostTitle,
				message: post.PostBody.slice(0, 300)
					.replace(/&lt;.+?(?=&gt;)&gt;/gi, '')
					.replace(/(<([^>]+)>)/gi, '')
					.replace(/&lt;.*/gi, ''),
				user: post.UserId,
				id: post.PostId,
				isMe: post.UserId === id,
				isAdmin: admin,
				encrypted: post.Encrypted,
			}));
		return NextResponse.json({ posts: allPosts }, { status: 200 });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

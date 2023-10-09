import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { formatReactions, compileComments } from '../../../lib/conversions';


export async function GET(request) {
	var reactions = '';
	var comments=  '';

	var session;
	session = await getServerSession(request);
	
	const { searchParams } = new URL(request.url);
	const articleid = searchParams.get('article');

	let isRegistered = false;

	if(session) {
		let querySQL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/finduserbyemail?email=${session.user.email}`;
		const res = await fetch(querySQL);
		let userData = await res.json();
		userData = userData.user;
		if (userData == null) {
			isRegistered = false;
		} else {
			session = {}
			isRegistered = true;
		}
	}

	try {
		const postSql = `SELECT PostId, PostTitle, PostBody, UserId, Encrypted FROM posts WHERE PostId=${articleid}`;
		const valueParams = [];
		const retrievedPost = await query({
			query: postSql,
			values: [valueParams],
		});

		const userid = retrievedPost[0].UserId;
		var title = retrievedPost[0].PostTitle;
		var content = retrievedPost[0].PostBody;
		const encrypted = retrievedPost[0].Encrypted;

		if (encrypted) {
			content = atob(content);
			title = atob(title);
		} else {
			content = content
				.replaceAll('&lt;', '<')
				.replaceAll('&gt;', '>')
				.replaceAll('&apos;', "'");
			title = title
				.replaceAll('&lt;', '<')
				.replaceAll('&gt;', '>')
				.replaceAll('&apos;', "'");
		}
		
		const userSql = `SELECT FirstName, LastName FROM users WHERE UserId=${userid}`;
		const author = await query({ query: userSql, values: [valueParams] });
		
		if (isRegistered) {
			const reactSQL = `SELECT Reaction FROM reactions WHERE PostId=${articleid}`;
			let rawReactions = await query({
				query: reactSQL,
				values: [valueParams],
			});
			reactions = formatReactions(rawReactions);
			
			const commentSQL = `SELECT CommentId, UserId, PostId, Comment FROM comments WHERE PostId=${articleid} AND Deleted=0`;
			const usersSQL = `SELECT FirstName, LastName, UserId FROM users WHERE Deleted=0`;
			let rawComments = await query({
				query: commentSQL,
				values: [valueParams],
			});
			let rawUsers = await query({ query: usersSQL, values: [valueParams] });
			comments = compileComments(rawComments, rawUsers);
		} else {
			reactions = '';
			comments = '';
		}
		
		const name = author[0].FirstName + ' ' + author[0].LastName;

		const article = {
			title: title,
			article: content,
			author: name,
			authorid: userid,
			postid: articleid,
			articleid: articleid,
			reactions: reactions,
			comments: comments,
			layout: false,
		};


		return NextResponse.json({ article: article }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

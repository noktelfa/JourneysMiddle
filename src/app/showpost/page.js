'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function GET(request) {

	const { data: session, status } = useSession();
	const [showReactions, setShowReactions] = useState(false);
	
		const [article, setArticle] = useState({
			title: '',
			content: '',
			author: '',
			authorid: '',
			articleid: '',
			reactions: '',
			comments: '',
			isReader: '',
		});

	if (status === 'loading') return <h1> loading... please wait</h1>;

	const isLogged = status === 'authenticated';
	const isAdmin = isLogged && session.admin;
	
	const router = useRouter();

	const showReact = () => {
		setShowReactions(true);
	}

	const deleteArticle = async () => {
			const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/deletearticle`;
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				postid: article.articleid,
				user: 0,
			}),
		});
		router.push(`${process.env.NEXT_PUBLIC_SITE_URL}`);
	};
	
	const createComment = () => {
		document.getElementById('newCommentBox').style.display = 'grid';
		document.getElementById('addCommentButton').style.display = 'none';
		document.getElementById('newCommentBox').focus();
	}

	const saveComment = async () => {
		document.getElementById('newCommentBox').style.display = 'none';
		document.getElementById('addCommentButton').style.display = 'grid';
		const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/savecomment`;
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				comment: document.getElementById('newComment').value,
				articleid: article.articleid,
			}),
		});
		const res = await response.json();
		document.getElementById('newComment').value = '';
		setArticle({
			...article,
			comments: res.comments,
		})
	}
	
	const like = async (emote) => {
		setShowReactions(false);
		const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/like`;
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				articleid: article.articleid,
				emote: emote,
			})
		});
		const res = await response.json()
		setArticle({
			...article,
			reactions: res.likes
		});
	};

	const searchParams = useSearchParams();
	const post = searchParams.get('post');
	
	try { 
		useEffect(() => {
			async function getPostData() {
				const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/showpost?article=${post}`;
				const response = await fetch(apiUrlEndpoint, {
					method: "GET",
					credentials: 'include',
				});
				const res = await response.json();
				var isReader = isLogged && session && session.userid === res.article.authorid;
				if(res.article) {
					setArticle({
						title: res.article.title,
						content: res.article.article,
						author: res.article.author,
						authorid: res.article.authorid,
						articleid: post,
						reactions: res.article.reactions,
						comments: res.article.comments,
						isReader: isReader,
					});
				}
			}
			getPostData();
		}, []);

		return (
			<div className="flex min-h-screen flex-col items-center p-6">
				<div key={article.id} id="showPost">
					{isLogged && (
						<div id="buttonBox">
							{article.isReader && (
								<Link
									href={{
										pathname: '/editpost',
										query: { article: post },
									}}
								>
									<button id="editPostButton">Edit</button>
								</Link>
							)}
							{(article.isReader || isAdmin) && (
								<div>
									<button id="showPostDeleteButton" onClick={deleteArticle}>
										Delete
									</button>
							</div>
								)}
						</div>
					)}
					<h1 id="postTitle">{article.title}</h1>
					<h3 id="postAuthor">
						author:&nbsp;
						<em>
							<Link
								href={{
									pathname: '/edituser',
									query: { user: article.authorid },
								}}
								className="clickable"
							>
								{article.author}
							</Link>
						</em>
					</h3>
					<br />

					<br />
					<div
						id="message"
						dangerouslySetInnerHTML={{ __html: article.content }}
					/>
				</div>
				<div className="reactBox">
					<div
						className={showReactions ? 'reactioninvisible' : 'reaction'}
						id="reaction"
						dangerouslySetInnerHTML={{ __html: article.reactions }}
						onClick={showReact}
					></div>
					<div
						className="react"
						style={{ display: showReactions ? 'block' : '' }}
					>
						<span className="tooltip" alt="Like" onClick={() => like('Like')}>
							👍
							<span className="tooltiptext">Like</span>
						</span>
						<span
							className="tooltip"
							alt="Dislike"
							onClick={() => like('Dislike')}
						>
							👎
							<span className="tooltiptext">Dislike</span>
						</span>
						<span className="tooltip" alt="Love" onClick={() => like('Love')}>
							❤<span className="tooltiptext">Love</span>
						</span>
						<span className="tooltip" alt="Laugh" onClick={() => like('Laugh')}>
							😆
							<span className="tooltiptext">Laugh</span>
						</span>
						<span className="tooltip" alt="ROFL" onClick={() => like('ROFL')}>
							🤣
							<span className="tooltiptext">ROFL</span>
						</span>
						<span
							className="tooltip"
							alt="Surprised"
							onClick={() => like('Surprised')}
						>
							😲
							<span className="tooltiptext">Surprised</span>
						</span>
						<span className="tooltip" alt="Cry" onClick={() => like('Cry')}>
							😭
							<span className="tooltiptext">Cry</span>
						</span>
						<span className="tooltip" alt="Angry" onClick={() => like('Angry')}>
							😡
							<span className="tooltiptext">Angry</span>
						</span>
						<span className="tooltip" alt="Hug" onClick={() => like('Hug')}>
							🧸
							<span className="tooltiptext">Hug</span>
						</span>
						<span
							className="tooltip"
							alt="no reaction"
							onClick={() => like('')}
						>
							(none)
							<span className="tooltiptext">No reaction</span>
						</span>
					</div>
				</div>
				<br />
				{status === 'authenticated' && (
					<div id="commentSection">
						<table id="commentHeader">
							<tr id="commentHeaderRow">
								<td className="hangLeft commentsHeader">Comments</td>
								<td id="addCommentButtonSpan" className="hangRight">
									<span id="addCommentButton" onClick={createComment}>
										Add a comment
									</span>
								</td>
							</tr>
						</table>
						<div id="newCommentBox">
							<div id="newCommentForTitle"></div>
							<textarea
								name="newComment"
								id="newComment"
								cols="30"
								rows="10"
							></textarea>
							<button
								id="saveCommentButton"
								className="newPostButton"
								onClick={saveComment}
							>
								Post Comment
							</button>
						</div>
						<div
							id="comments"
							dangerouslySetInnerHTML={{ __html: article.comments }}
						></div>
					</div>
				)}
			</div>
		);
	} catch(error)
	{
		console.log(error)
		return;
	}
}


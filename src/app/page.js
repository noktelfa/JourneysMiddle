"use client"

import { useEffect, useState } from 'react'; 
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {

	useEffect(() => {
		async function getPageData() {
			const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/getallposts`;
			const response = await fetch(apiUrlEndpoint);
			const res = await response.json();
			setdataResponse(res.posts);
		}
		getPageData();
	}, []);

	const { session, status, update } = useSession();
	const [dataResponse, setdataResponse] = useState([]);

	if (status === 'loading') return <h1> loading... please wait</h1>;

	return (
		<div className="flex min-h-screen flex-col items-center p-6">
			<div className="hangLeft">
				<Link href={{ pathname: '/newpost' }}>
					<button className="newPostButton" id="newPostButton">
						New Post
					</button>
				</Link>
			</div>

			{dataResponse.map((post) => {
				return (
					<div key={post.id} className="post">
						<div>
							{post.encrypted ? (
								<h2 className="postTitle">{atob(post.title)}</h2>
							) : (
								<h2 className="postTitle">{post.title}</h2>
							)}
						</div>
						<div className="postAuthor">author:&nbsp;&nbsp;{post.name}</div>
						<Link
							href={{
								pathname: 'showpost',
								query: { post: post.id },
							}}
							prefetch={false}
						>
							{post.encrypted ? (
								<div
									className="fadeBottom"
									dangerouslySetInnerHTML={{ __html: atob(post.message) }}
								></div>
							) : (
								<div
									className="fadeBottom"
									dangerouslySetInnerHTML={{ __html: post.message }}
								></div>
							)}
						</Link>
					</div>
				);
			})}
		</div>
	);
}

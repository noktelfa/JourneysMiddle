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

	const { data: session, status } = useSession();
	const [dataResponse, setdataResponse] = useState([]);
 
	
	if (status === 'loading') return <h1> loading... please wait</h1>;
	const isLogged = status === 'authenticated'
	
	if (status === 'authenticated') {
		if (session && session.token.theme === 'light') {
			document.body.classList.remove('theme-dark');
			document.body.classList.add('theme-light');
		} else if (session && session.token.theme === 'dark') {
			document.body.classList.remove('theme-light');
			document.body.classList.add('theme-dark');
		}
	}


	return (
		<div className="flex min-h-screen flex-col items-center p-6">
			{isLogged && (
			<div className="hangLeft">
				<Link href={{ pathname: '/newpost' }}>
					<button className="newPostButton" id="newPostButton">
						New Post
					</button>
				</Link>
			</div>
			)}
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

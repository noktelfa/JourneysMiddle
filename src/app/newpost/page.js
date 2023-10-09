'use client'

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('../components/Editor'), { ssr: false });

export default function GET(request) {

	const router = useRouter();
	const { data: session, status } = useSession();

	const editorRef = useRef();
	const [editorLoaded, setEditorLoaded] = useState(false);
	const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
		editorRef.current = {
			CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
			ClassicEditor: require('../../ckeditor5'),
		};
		setEditorLoaded(true);
	}, []);
	
	const [articleContent, setarticleContent] = useState([]);
	
	if (status === 'loading') return <h1> loading... please wait</h1>;
	
	var id = 0;
	if (session && session.userid) {
		id = session.userid;
	}
	
	const createPost = async () => {
		const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/createpost`;
		const content = btoa(articleContent);
		const title = btoa(document.getElementById('title').value);
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title: title,
				postText: content,
				id: id,
			}),
		});
		const reply = await response.json();
		router.push(`${process.env.NEXT_PUBLIC_SITE_URL}`);
	};

	return (
		<div className="flex min-h-screen flex-col items-center p-6">
			<div id="newPost">
				<label htmlFor="title">Title: </label>
				<input type="text" name="title" id="title" />
				<br />
				<br />
				{editorLoaded ? (
					<CKEditor
						className="mt-3 wrap-ckeditor"
						editor={ClassicEditor}
						onChange={(event, editor) => {
							const data = editor.getData();
							setarticleContent(data)
						}}
					/>
				) : (
					'loading...'
				)}
				<div id="viewer"></div>
				<br />
				<br />
				<input type="hidden" name="id" value={id} />
				<button id="postMessageButton" className="newPostButton" onClick={createPost}>
					Post Message
				</button>
				&nbsp;
				<Link href={{ pathname: '/' }}>
					<button id="cancelButton" className="deleteButton">Cancel</button>
				</Link>
			</div>
		</div>
	);
}

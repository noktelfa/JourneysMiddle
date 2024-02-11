'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function GET(request) {

  const searchParams = useSearchParams();
  const post = searchParams.get('article');

  const { data: session, status } = useSession();
  
	const editorRef = useRef();
	const [editorLoaded, setEditorLoaded] = useState(false);
	const { CKEditor, ClassicEditor } = editorRef.current || {};
	const [articleContent, setArticleContent] = useState([]);
	const [articleTitle, setArticleTitle] = useState([]);
  
  useEffect(() => {
    async function getPostData() {
      editorRef.current = {
        CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
        ClassicEditor: require('../../ckeditor5'),
      };
      setEditorLoaded(true);
			const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/showpost?article=${post}`;
			const response = await fetch(apiUrlEndpoint, {
				method: 'GET',
				credentials: 'include',
			});
			const res = await response.json();
			if (res.article) {
        setArticleContent(res.article.article);
        setArticleTitle(res.article.title)
			}
		}
		getPostData();
	}, []);

  if (status === 'loading') return <h1> loading... please wait</h1>;

	const router = useRouter();

  const saveChanges = async () => {
		const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/updatearticle`;
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: post,
        title: btoa(articleTitle),
        content: btoa(articleContent)
			}),
		});
    router.push(`${process.env.NEXT_PUBLIC_SITE_URL}`);
  }

	try {

		return (
			<div className="flex min-h-screen flex-col items-center p-6">
				<div id="showPost">
					<label htmlFor="title">Title: </label>
					{/* <input
						type="text"
						name="title"
						id="title"
						value={articleTitle}
						onChange={(e) => setArticleTitle(e.target.value)}
						className="editTitle"
					/> */}
					<span
						name="title"
						id="title"
						onBlur={(e) => setArticleTitle(e.target.innerHTML)}
						className="editTitle"
						contentEditable
					>
						{articleTitle}
					</span>
					<br />
					<br />
					<div id="editorBox">
						{editorLoaded ? (
							<CKEditor
								className="mt-3 wrap-ckeditor"
								editor={ClassicEditor}
								data={articleContent}
								onChange={(event, editor) => {
									const data = editor.getData();
									setArticleContent(data);
								}}
							/>
						) : (
							'loading...'
						)}
						<button id="saveChangesButton" onClick={saveChanges}>
							Save Changes
						</button>
					</div>
				</div>
			</div>
		);
	} catch (error) {
		console.log(error);
		return;
	}
}

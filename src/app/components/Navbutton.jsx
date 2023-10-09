'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbutton() {
	const { data: session, status, update } = useSession();
	const [showNavigation, setShowNavigation] = useState(false);

	if (status === 'loading') return <div></div>;
	
	const toggleMenu = () => {
		setShowNavigation(!showNavigation);
	};

	const themeSwap = () => {
		if (document.body.className.match('theme-dark')) {
			document.body.classList.remove('theme-dark');
			document.body.classList.add('theme-light');
			if (session) updateTheme(session.userid, 'light');
		} else if (document.body.className.match('theme-light')) {
			document.body.classList.remove('theme-light');
			document.body.classList.add('theme-dark');
			if (session) updateTheme(session.userid, 'dark');
		}
		toggleMenu();
	};
	
	const updateTheme = async (id, newTheme) => {
		const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/updatetheme`;
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: id,
				theme: newTheme,
			}),
		});
	};

	const isProfile = session && session.isRegistered;
	const isAuthed = status === 'authenticated';
	const isAdmin = session && session.admin;

	return (
		<div>
			<div id="navbutton">
				<button id="trigram" onClick={toggleMenu}>
					<span></span>
					<span></span>
					<span></span>
				</button>
			</div>

			<div id="navbuttonbox" className={showNavigation ? 'present' : 'absent'}>
				<ul className="menulist">
					<li>
						<Link href="/" onClick={toggleMenu}>
							<span>Message Board</span>
						</Link>
					</li>
					{isProfile && (
						<li>
							{isProfile && (
								<Link href="/profile" onClick={toggleMenu}>
									<span>Profile</span>
								</Link>
							)}
						</li>
					)}
					{isAdmin && (
						<li>
							<Link href="/admin" onClick={toggleMenu}>
								<span>Admin Utils</span>
							</Link>
						</li>
					)}
					<li>
						<Link href="/roadmap" onClick={toggleMenu}>
							<span>Roadmap</span>
						</Link>
					</li>
					<li>
						<span
							onClick={() => {
								toggleMenu();
								themeSwap();
							}}
						>
							Change Theme
						</span>
					</li>
					{isAuthed && (
						<li>
							<span
								onClick={() => {
									toggleMenu();
									signOut({ callbackUrl: '/' });
								}}
							>
								Log out
							</span>
						</li>
					)}
					{!isAuthed && (
						<li>
							<Link href="/login" onClick={toggleMenu}>
								<span>Login</span>
							</Link>
						</li>
					)}
					{!isAuthed && (
						<li>
							<Link href="/register" onClick={toggleMenu}>
								<span>(Register)</span>
							</Link>
						</li>
					)}
				</ul>
			</div>
			<div
				id="dimmer"
				className={showNavigation ? 'dimmed' : 'undimmed'}
				onClick={toggleMenu}
			></div>
		</div>
	);
}

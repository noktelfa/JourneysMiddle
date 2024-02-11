'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
	const { data: session, status, update } = useSession();
	const [hoveredPath, setHoveredPath] = useState();

	if(status === 'loading') return (<div></div>)
	
	let pathname = usePathname() || '/';
	if (pathname == '/showpost') pathname = '/';
	
	
	const themeSwap = () => {
		if(document.body.className.match('theme-dark')) {
			document.body.classList.remove('theme-dark')
			document.body.classList.add('theme-light');
			if(session) updateTheme(session.userid, 'light');
		} else if(document.body.className.match('theme-light')) {
			document.body.classList.remove('theme-light');
			document.body.classList.add('theme-dark');
			if(session) updateTheme(session.userid, 'dark');
		}
	} 
	
	const updateTheme = async (userid, newTheme) => {
		const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/updatetheme`;
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userid: userid,
				theme: newTheme,
			}),
		});
	};

	const isProfile = session && session.isRegistered;
	const isAuthed = status === 'authenticated';
	const isAdmin = session && session.admin;

	return (
		<div id="navbarContainer">
			<div
				id="navbar"
				className="border border-stone-800/90 p-[0.4rem] rounded-lg mb-12 sticky top-4 z-[100] bg-stone-900/80 backdrop-blur-md"
			>
				<nav className="flex gap-2 relative justify-start w-full z-[100]  rounded-lg">
					<Link
						href="/"
						className={`px-4 py-2 rounded-md text-sm lg:text-base relative no-underline duration-300 ease-in`}
						onMouseOver={() => setHoveredPath('/')}
						onMouseLeave={() => setHoveredPath(pathname)}
					>
						<span>Message Board</span>
						{'/' === hoveredPath && (
							<motion.div
								className="absolute bottom-0 left-0 h-full bg-stone-800/80 rounded-md -z-10 cursorBlock"
								layoutId="navbar"
								aria-hidden="true"
								style={{
									width: '100%',
								}}
								transition={{
									type: 'spring',
									bounce: 0.25,
									stiffness: 130,
									damping: 9,
									duration: 0.3,
								}}
							/>
						)}
					</Link>

					{isProfile && (
						<Link
							href="/profile"
							className={`px-4 py-2 rounded-md text-sm lg:text-base relative no-underline duration-300 ease-in`}
							onMouseOver={() => setHoveredPath('/profile')}
							onMouseLeave={() => setHoveredPath(pathname)}
						>
							<span>Profile</span>
							{'/profile' === hoveredPath && (
								<motion.div
									className="absolute bottom-0 left-0 h-full bg-stone-800/80 rounded-md -z-10 cursorBlock"
									layoutId="navbar"
									aria-hidden="true"
									style={{
										width: '100%',
									}}
									transition={{
										type: 'spring',
										bounce: 0.25,
										stiffness: 130,
										damping: 9,
										duration: 0.3,
									}}
								/>
							)}
						</Link>
					)}

					{isAdmin && (
						<Link
							href="/admin"
							className={`px-4 py-2 rounded-md text-sm lg:text-base relative no-underline duration-300 ease-in`}
							onMouseOver={() => setHoveredPath('/admin')}
							onMouseLeave={() => setHoveredPath(pathname)}
						>
							<span>Admin Utils</span>
							{'/admin' === hoveredPath && (
								<motion.div
									className="absolute bottom-0 left-0 h-full bg-stone-800/80 rounded-md -z-10 cursorBlock"
									layoutId="navbar"
									aria-hidden="true"
									style={{
										width: '100%',
									}}
									transition={{
										type: 'spring',
										bounce: 0.25,
										stiffness: 130,
										damping: 9,
										duration: 0.3,
									}}
								/>
							)}
						</Link>
					)}

					<Link
						href="/roadmap"
						className={`px-4 py-2 rounded-md text-sm lg:text-base relative no-underline duration-300 ease-in`}
						onMouseOver={() => setHoveredPath('/roadmap')}
						onMouseLeave={() => setHoveredPath(pathname)}
					>
						<span>Roadmap</span>
						{'/roadmap' === hoveredPath && (
							<motion.div
								className="absolute bottom-0 left-0 h-full bg-stone-800/80 rounded-md -z-10 cursorBlock"
								layoutId="navbar"
								aria-hidden="true"
								style={{
									width: '100%',
								}}
								transition={{
									type: 'spring',
									bounce: 0.25,
									stiffness: 130,
									damping: 9,
									duration: 0.3,
								}}
							/>
						)}
					</Link>

					<span
						className={`px-4 py-2 rounded-md text-sm lg:text-base relative no-underline duration-300 ease-in `}
						onMouseOver={() => setHoveredPath('/themer')}
						onMouseLeave={() => setHoveredPath(pathname)}
						onClick={() => themeSwap()}
					>
						<span>Change Theme</span>
						{'/themer' === hoveredPath && (
							<motion.div
								className="absolute bottom-0 left-0 h-full bg-stone-800/80 rounded-md -z-10 cursorBlock"
								layoutId="navbar"
								aria-hidden="true"
								style={{
									width: '100%',
								}}
								transition={{
									type: 'spring',
									bounce: 0.25,
									stiffness: 130,
									damping: 9,
									duration: 0.3,
								}}
							/>
						)}
					</span>

					{isAuthed && (
						<span
							className={`px-4 py-2 rounded-md text-sm lg:text-base relative no-underline duration-300 ease-in`}
							onMouseOver={() => setHoveredPath('/logout')}
							onMouseLeave={() => setHoveredPath(pathname)}
							onClick={() => signOut({ callbackUrl: '/' })}
						>
							<span>Log out</span>
							{'/logout' === hoveredPath && (
								<motion.div
									className="absolute bottom-0 left-0 h-full bg-stone-800/80 rounded-md -z-10 cursorBlock"
									layoutId="navbar"
									aria-hidden="true"
									style={{
										width: '100%',
									}}
									transition={{
										type: 'spring',
										bounce: 0.25,
										stiffness: 130,
										damping: 9,
										duration: 0.3,
									}}
								/>
							)}
						</span>
					)}

					{!isAuthed && (
						<Link
							href="/login"
							className={`px-4 py-2 rounded-md text-sm lg:text-base relative no-underline duration-300 ease-in`}
							onMouseOver={() => setHoveredPath('/login')}
							onMouseLeave={() => setHoveredPath(pathname)}
						>
							<span>Login</span>
							{'/login' === hoveredPath && (
								<motion.div
									className="absolute bottom-0 left-0 h-full bg-stone-800/80 rounded-md -z-10 cursorBlock"
									layoutId="navbar"
									aria-hidden="true"
									style={{
										width: '100%',
									}}
									transition={{
										type: 'spring',
										bounce: 0.25,
										stiffness: 130,
										damping: 9,
										duration: 0.3,
									}}
								/>
							)}
						</Link>
					)}

					{!isAuthed && (
						<Link
							href="/register"
							className={`px-4 py-2 rounded-md text-sm lg:text-base relative no-underline duration-300 ease-in`}
							onMouseOver={() => setHoveredPath('/register')}
							onMouseLeave={() => setHoveredPath(pathname)}
						>
							<span>(Register)</span>
							{'/register' === hoveredPath && (
								<motion.div
									className="absolute bottom-0 left-0 h-full bg-stone-800/80 rounded-md -z-10 cursorBlock"
									layoutId="navbar"
									aria-hidden="true"
									style={{
										width: '100%',
									}}
									transition={{
										type: 'spring',
										bounce: 0.25,
										stiffness: 130,
										damping: 9,
										duration: 0.3,
									}}
								/>
							)}
						</Link>
					)}
				</nav>
			</div>
		</div>
	);
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
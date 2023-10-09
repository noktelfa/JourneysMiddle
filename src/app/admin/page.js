'use client'

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function GET(request) {

	const { data: session, status } = useSession();
	
  useEffect(() => {
		async function getUserList() {
			const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/getuserlist`;
			const response = await fetch(apiUrlEndpoint);
			const res = await response.json();
			setUserList(res.userlist);
		}
		getUserList();
	}, []);
	
	const [userList, setUserList] = useState([]);
  if (status === 'loading') return <h1> loading... please wait</h1>;
  if (status === 'unathenticated') router.replace(`${process.env.NEXT_PUBLIC_SITE_URL}`);
  
	var userTable = [];
	userList.forEach(user => {
		let entry = '<tr>'
		entry += '<td class="userListTable">'
		if(user.Deleted) entry += '(deleted)'
		if(user.Admin) entry += '(admin)'
		entry += '</td><td class="userListTable">';
		entry += `<a href='${process.env.NEXT_PUBLIC_SITE_URL}/admin/useredit?user=${user.UserId}'>`;
		entry += user.FirstName + ' ' + user.LastName
		entry += '</a></td><td class="userListTable">'
		entry += `<a href="mailto:${user.Email}"}>${user.Email}</a></td></tr>\n`;
		userTable += entry
	})

	const router = useRouter();

	if(!session.admin) router.replace(`${process.env.NEXT_PUBLIC_SITE_URL}`);

	return (
		<div className="flex min-h-screen flex-col items-center p-6">
			<table dangerouslySetInnerHTML={{__html: userTable}} id='adminUserTable'>
			</table>
		</div>
	);
}
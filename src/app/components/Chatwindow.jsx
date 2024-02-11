'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Chatwindow () {
  const { data: session, status, update } = useSession();
  if (status === 'loading') return <div>Loading...</div>;
  if(status !== 'authenticated') return <div></div>;

  return (
    <div id="chat">
      Placeholder
    </div>
  )
}
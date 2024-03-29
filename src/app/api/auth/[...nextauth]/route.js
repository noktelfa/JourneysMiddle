import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials'


const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
		Credentials({
			name: "The Journey's Middle",
			credentials: {
				username: { label: 'Username', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/login`, {
					method: 'POST',
					body: JSON.stringify(credentials),
					headers: { 'Content-Type': 'application/json' },
				});
				const user = await res.json();
				if (res.ok && user) {
					console.log('user:', user, '\ntypeof user:', typeof user)
					return user;
				}
				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, account, profile, isNewUser }) {
			if(token.sub) {
				const getUser = await fetch(
					`${process.env.NEXT_PUBLIC_SITE_URL}/api/finduserbyemail?email=${token.email}`
				);
				let userData = await getUser.json();
					if (userData) {
					token.admin = userData.user.admin;
					token.deleted = userData.user.deleted;
				}
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (typeof token !== typeof undefined) {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SITE_URL}/api/finduserbyemail?email=${token.email}`
				);
				let userData = await res.json();
				userData = userData.user;
				if (userData != null) {
					session.userid = userData.userid;
					session.admin = !!userData.admin;
					session.deleted = !!userData.deleted;
					session.isRegistered = true;
					token.admin = !!userData.admin;
					token.theme = userData.theme;
				}
				session.token = token;
			}
			session.user = token.users;
			return session;
		},
		async signIn({ account, profile }) {
			if (account.provider === 'google') {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_SITE_URL}/api/finduserbyemail?email=${profile.email}`
				);
				let userData = await res.json();
				if (userData !== null && userData.user.deleted) return false;
				return profile.email_verified;
			}

			if (account.provider === 'credentials') return !account.deleted;
			
			return true;
		},
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60,
		updateAge: 24 * 60 * 60,
		generateSessionToken: () => {
			return randomUUID?.() ?? randomBytes(32).toString('hex');
		},
	},
	debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
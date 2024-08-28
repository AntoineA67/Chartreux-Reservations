import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import AzureADProvider from "next-auth/providers/azure-ad";

export type Session = {
	user: User;
};


export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/auth/signin",
	},
	providers: [
		// Use Github to login
		// GithubProvider({
		// 	clientId: process.env.GITHUB_ID ?? "",
		// 	clientSecret: process.env.GITHUB_SECRET ?? "",
		// }),
		AzureADProvider({
			clientId: process.env.AZURE_AD_CLIENT_ID ?? "",
			clientSecret: process.env.AZURE_AD_CLIENT_SECRET ?? "",
			tenantId: process.env.AZURE_AD_TENANT_ID ?? "",
			authorization: { params: { scope: "openid profile user.Read email" } },
			userinfo: {
				url: 'https://graph.microsoft.com/v1.0/me?$select=jobTitle,displayName,givenName,id,mail,surname',
				params: {
					scope: 'https://graph.microsoft.com/user.read',
					grant_type: 'authorization_code',
				},
			},
			async profile(profile, tokens) {
				const response = await fetch(
					`https://graph.microsoft.com/v1.0/me?$select=jobTitle,displayName,givenName,id,mail,surname`,
					{ headers: { Authorization: `Bearer ${tokens.access_token}` } }
				)
				const newProfile = await response.json()
				if (newProfile) {
					const user = await prisma.user.findUnique({ where: { email: profile.email } })
					if (user && user.name === null) {
						await prisma.user.update({ where: { id: user.id }, data: { name: newProfile.displayName } })
					}
				}
				return {
					id: profile.sub,
					name: newProfile.displayName,
					email: profile.email,
					accountStatus: profile.accountEnabled,
					class: newProfile.jobTitle,
				};
			},
		}),
	],
	adapter: PrismaAdapter(prisma),
	callbacks: {
		session: ({ session, token }) => {
			return {
				...session,
				user: {
					...session.user,
					class: token.class,
					id: token.id,
					role: token.role,
					name: token.name,
				},
			};
		},
		jwt: async ({ token }) => {
			const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });

			if (dbUser) {
				const u = dbUser as User;
				return {
					...token,
					class: u.class,
					id: u.id,
					role: u.role,
				};
			}
			return token;
		},
	},
};


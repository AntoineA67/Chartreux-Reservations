'use server'
import { Session, authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

export const isAdmin = (session: Session) => {
	return session && (session.user.role === "admin" || session.user.email?.endsWith("@leschartreux.net"));
}

export async function getProfiles() {
	const session = await getServerSession(authOptions) as Session;
	// console.log(session)
	if (isAdmin(session)) {
		const userInfo = await prisma.user
			.findMany({
				where: {
					OR: [
						{
							role: 'user'
						},
						{
							role: 'admin'
						},
					],
				},
				select: {
					name: true,
					class: true,
					image: true,
					email: true,
					id: true,
				}
			});
		return userInfo
	}
	return null;
}

export async function getExcludedDays() {
	const session = await getServerSession(authOptions) as Session;
	if (isAdmin(session)) {
		const exclDays = await prisma.excludedDays
			.findMany({
				select: {
					date: true,
				}
			});
		return exclDays
	}
	return null;
}

export const deleteProfileById = async (id: string) => {
	const session = await getServerSession(authOptions) as Session;
	if (isAdmin(session)) {
		try {

			const userInfo = await prisma.user
				.delete({
					where: { id: id },
				});
			return { message: "success", data: userInfo }
		} catch (e) {
			console.log(e)
			return { message: "error", data: null };
		}
	}
	return { message: "error", data: null };
}
export const getProfileById = async (id: string) => {
	const session = await getServerSession(authOptions) as Session;
	if (isAdmin(session)) {
		try {

			const userInfo = await prisma.user
				.findUnique({
					where: { id: id },
					include: {
						reservations: true
					}
				});
			return { message: "success", data: userInfo }
		} catch (e) {
			console.log(e)
			return { message: "error", data: null };
		}
	}
	return { message: "error", data: null };
}

export async function getProfile() {
	const session = await getServerSession(authOptions);
	if (session) {
		const userInfo = await prisma
			.user
			.findUnique({
				where: { email: session?.user?.email as undefined },
				select: {
					name: true,
					class: true,
					image: true,
					// reservations: {
					// 	where: {
					// 		date: {
					// 			gte: new Date(),
					// 			lte: new Date(new Date().getTime() + 8 * msToDay)
					// 		}
					// 	},
					// }
				}
			});
		// console.log(userInfo)
		return userInfo
	}
	return null;
}
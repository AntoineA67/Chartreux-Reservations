'use server';
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { add, format, set } from "date-fns";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Session } from "@/lib/auth";
import { msToDay } from "@/constants";
import { startOfDay } from "date-fns";
import moment from "moment";
import { getExcludedDays, isAdmin } from "./Profile.actions";

type APIResponse = {
	message: string;
	data: any;
}

//TODO fix this not working at 1 am because UTC+2
async function getNextReservationsDays(): Promise<Date[]> {
	const dates: Date[] = [];
	const today = new Date();

	const excludedDays = await prisma.excludedDays.findMany({
		select: {
			date: true,
		},
		where: {
			date: {
				gte: startOfDay(today),
				lt: startOfDay(add(today, { days: 8 })),
			}
		}
	});

	for (let i = 0; i <= 8; i++) {
		const day: Date = new Date(today.getTime() + i * msToDay);
		if (day.getDay() <= 4 && day.getDay() >= 1 && !excludedDays.find((excludedDay) => excludedDay.date.toDateString() === day.toDateString())) {
			dates.push(new Date(day.setUTCHours(0, 0, 0, 0)));
		}
	}

	return dates;
}


export const invertDayExclusion = async (date: string) => {
	const session = await getServerSession(authOptions) as Session;
	if (isAdmin(session)) {

		try {
			const dt = new Date(date)
			// console.log(dt)
			dt.setUTCHours(0, 0, 0, 0)
			let existingExclusion = await prisma.excludedDays.findUnique({
				where: {
					date: dt
				},
				select: { id: true, date: true }
			})
			// console.log(existingExclusion)
			if (!existingExclusion) {
				const day = await prisma.excludedDays.create({
					data: { date: dt },
				});
				// revalidatePath('/admin')
				return { message: "success", data: await getExcludedDays() }
			} else {
				const day = await prisma.excludedDays.delete({
					where: { id: existingExclusion.id },
				});
				// revalidatePath('/admin')
				return { message: "success", data: await getExcludedDays() }
			}
		} catch (e) {
			console.log(e)
			return { message: "error", data: null }
		}
	}
	else {
		return { message: "error", data: null }
	}
}

// export const getReservationsForDay = async (formData: FormData | null): Promise<APIResponse> => {
export const getReservationsForDay = async (formData: FormData | null, dateString: string | null): Promise<APIResponse> => {
	'use server'
	// console.log("getReservationsForDay")
	// if (!formData) return ({ message: "No data", data: null });
	// const dateString = formData.get('date') as string;
	// if (!dateString) return ({ message: "No data", data: null });
	if (!dateString) return ({ message: "No data", data: null });
	try {
		const date = new Date(dateString);
		const reservations: any = await prisma.reservation.findMany({
			where: {
				date: date,
			},
			orderBy: {
				roomName: 'asc',
			},
			select: {
				user: {
					select: {
						name: true,
						class: true,
						email: true,
					}
				},
				roomName: true,
			}
		})
		// console.log(reservations)
		// revalidatePath('/')
		return { message: "success", data: reservations }
	} catch (error) {
		console.log(error)
		return ({ message: "error", data: null });
	}
}

export const getReservations = async (): Promise<any[]> => {
	const session = await getServerSession(authOptions) as Session;
	const nextReservations = await getNextReservationsDays();

	const reservations = await prisma.reservation.groupBy({
		by: ['date', 'roomName', 'userId', 'id'],
		where: {
			date: {
				in: nextReservations,
			}
		},
		orderBy: {
			date: 'asc'
		}
	})
	const rooms = await prisma.room.findMany({ select: { name: true, capacity: true } })

	let nextReservationsWithRoom: any = {}
	nextReservations.forEach((date) => {
		const cap = rooms.reduce((acc: any, room: any) => acc + room.capacity, 0)
		nextReservationsWithRoom[date.toDateString()] = {
			date: date,
			capacity: cap,
			capacityLeft: cap,
			rooms: {},
			userHasReservation: null,
		}
		rooms.forEach((room: any) => {
			nextReservationsWithRoom[date.toDateString()].rooms[room.name] = {
				...room,
				capacityLeft: room.capacity,
			}
		})
	})
	reservations.forEach((reservation: any) => {
		const correspondingDate = nextReservationsWithRoom[reservation.date.toDateString()]
		// console.log(correspondingDate.rooms)
		correspondingDate.rooms[reservation.roomName]
			.capacityLeft -= 1
		correspondingDate.capacityLeft -= 1
		if (reservation.userId === session.user.id) {
			correspondingDate.userHasReservation = { reservationId: reservation.id, roomName: reservation.roomName }
		}
	})
	// console.log(JSON.stringify(nextReservationsWithRoom, null, 2))
	// console.log(nextReservationsWithRoom)
	revalidatePath('/')
	return Object.values(nextReservationsWithRoom)
}

const reservationSchema = z.object({
	userId: z.string().cuid(),
	date: z.coerce
		.date()
		// .min(add(new Date(), { hours: 1 }), { message: "Trop tard !" })
		// .max(add(new Date(), { days: 8 }), { message: "Trop tot !" })
		.transform((date) => {
			date.setHours(0, 0, 0, 0);
			return date;
		}),
	roomName: z.string(),
});

export const getRooms = async () => {
	return await prisma.room.findMany();
}

export const getRoomsNames = async () => {
	const rooms = await prisma.room.findMany();
	return Object.values(rooms).map((room: any) => room.name);
}

export const addReservation = async (date: Date, roomName: string) => {
	const session = await getServerSession(authOptions) as Session;
	const data = {
		userId: session.user.id,
		date: moment(date).utc().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate(),
		roomName: roomName as string,
	}

	try {

		if (moment(data.date.toISOString()).isSame(moment(), 'day') && moment().isAfter({ hours: 19 })) throw new Error("Trop tard !");
		else if (moment(data.date.toISOString()).isBefore(moment(), 'day')) throw new Error("Trop tard !");
		else if (moment(data.date.toISOString()).isAfter(moment().add(8, 'days'), 'day')) throw new Error("Trop tot !");
		// const newData = {...data, date: moment(date).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate()}
		// if (data.date.toDateString() === new Date().toDateString() && new Date().getHours() >= 19) throw new Error("Trop tard !");
		reservationSchema.parse(data)

		const reservationsForDate = await prisma.reservation.findMany({
			where: {
				date: data.date,
				roomName: roomName,
			}
		})
		const room = await prisma.room.findUnique({
			where: { name: roomName },
		});
		if (!room) throw new Error(`La salle ${roomName} n'existe pas !`);
		if (reservationsForDate.length >= room.capacity) throw new Error("Plus de place !");

		const reservation = await prisma.reservation.create({
			data: data,
		});
		revalidatePath('/')
		return { message: "success", data: reservation }
	}
	catch (e) {
		console.log(e)
		return { message: "error", data: null }
	}
}

export const deleteReservation = async (id: string) => {
	const session = await getServerSession(authOptions) as Session;

	try {
		let existingReservation = await prisma.reservation.findFirst({
			where: {
				id: id,
				userId: session.user.id,
			},
			select: {
				userId: true,
				date: true,
			}

		})
		if (!existingReservation || session.user.id !== existingReservation.userId) throw new Error("Trop tard !");
		if (existingReservation.date.toDateString() === new Date().toDateString() && new Date().getHours() >= 19) throw new Error("Trop tard !");
		const reservation = await prisma.reservation.delete({
			where: { id: id },
		});
		revalidatePath('/')
		return { message: "success", data: reservation }
	} catch (e) {
		console.log(e)
		return { message: "error", data: null }
	}
}
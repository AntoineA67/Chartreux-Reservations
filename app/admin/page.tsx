import { Profile } from '@/components/Profile';
import { Days } from '@/components/Days';
import { Container, Typography } from '@mui/material';
import * as React from 'react';
import { getReservations, getRoomsNames } from '@/actions/Reservation.actions';
import AdminDashboard from '@/components/AdminDashboard';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { Session, authOptions } from '@/lib/auth';
import { getExcludedDays, getProfiles, isAdmin } from '@/actions/Profile.actions';
import { ExcludedDays, User } from '@prisma/client';
// import Test from '@/components/Test';

export default async function AdminPage() {
	const days = await getReservations();
	const rooms = await getRoomsNames();
	const session = await getServerSession(authOptions) as Session
	const studs = await getProfiles() as Partial<User>[];
	const excludedDays = await getExcludedDays() as Partial<ExcludedDays>[];

	if (isAdmin(session)) {
		return (
			<Container>
				<Typography py={4} variant="h2">Choisir une date à exporter</Typography>
				<AdminDashboard days={days} rooms={rooms} studs={studs} excludedDays={excludedDays} />
			</Container>
		);
	}
	notFound();
}
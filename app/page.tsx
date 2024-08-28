import { Profile } from '@/components/Profile';
import { Days } from '@/components/Days';
import { Button, Container, Stack, Typography } from '@mui/material';
import * as React from 'react';
import { getReservations, getRoomsNames } from '@/actions/Reservation.actions';
import ExportReservationsForm from '@/components/AdminDashboard';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Session, authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@/components/Buttons';
import { signOut } from 'next-auth/react';
import prisma from '@/lib/prisma';
import { SignOutAuto } from '@/components/SignOutAuto';
import { isAdmin } from '@/actions/Profile.actions';
export const dynamic = 'force-dynamic'
export const revalidate = false

export default async function Home() {
	const days = await getReservations();
	const rooms = await getRoomsNames();
	const session = await getServerSession(authOptions) as Session;

	try {
		const user = await prisma.user.findUnique({ where: { id: session?.user?.id } });
		// console.log(user);
		if (user && user.name === null) {
			// console.log("LOGGING OUT BECAUSE NO NAME")
			return (<SignOutAuto />);
			// await signOut({ callbackUrl: '/' });
			// redirect('/api/auth/signout');
		}
	} catch (error) {

	}

	// if (session.user.role === 'admin') redirect('/admin');
	// if (session.user.class !== 'prepa') {
	// 	return (
	// 		<Container>
	// 			<Typography py={4} variant="h2">Cette application est réservée aux prépas !</Typography>
	// 		</Container>
	// 	);
	// }

	return (
		<>

			<Stack spacing={3} direction={{ sm: 'column', md: 'row' }} alignItems={'center'} justifyContent={'space-around'}>
				<Profile />

				{isAdmin(session) &&
					<Button variant="contained">
						<Link href="/admin">Accéder au dashboard</Link>
					</Button>
				}
			</Stack>
			{/* <Typography py={4} variant="h2">efeffejjk</Typography> */}
			<Days actionWrapper={ConfirmationDialog} days={days} rooms={rooms} />
			<Container>
				<SignOutButton />
			</Container>
		</>
	);
}
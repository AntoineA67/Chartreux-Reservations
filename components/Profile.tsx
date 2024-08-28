import { Box, Container, Grid, Typography } from "@mui/material";
import { getProfile } from "../actions/Profile.actions";
import Image from "next/image";
import logo from '../app/logoChartreux.png'

export async function Profile() {

	const user = await getProfile();
	if (!user) return null;

	return (
		<Container>
			<Box sx={{ display: 'flex', alignItems: { xs: 'self-start', sm: 'baseline' }, flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 2 }}>

				{/* {user.image &&
					<Box width={{ xs: 72, sm: 100 }} height={{ xs: 72, sm: 100 }} sx={{ borderRadius: 100 }} mt={2} component="img" src={user.image as unknown as undefined} order={{ xs: 2, sm: 1 }} />} */}
				{/* <Image src={user.image as unknown as string} width={100} height={100} className="rounded-full" /> */}
				<Image src={logo} alt="logo" width="300" height="300"
				/>
				<Typography variant="h3">Hello {user?.name} 👋</Typography>
				{/* order={{ xs: 1, sm: 2 }} */}
				<Typography gutterBottom textAlign={'left'}>Choisissez l&apos;endroit parfait pour vous concentrer et réussir. Réservez votre salle de travail dès maintenant.</Typography>
			</Box>
		</Container>
	);
};
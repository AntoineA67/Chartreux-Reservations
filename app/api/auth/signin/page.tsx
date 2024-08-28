'use client'

import { useEffect, useState } from "react"
import { signIn } from 'next-auth/react'
import { Button, Container, Grid, Paper, Stack } from "@mui/material"
import logo from '@/app/logoChartreux.png'
import Image from 'next/image'
import Typography from "@mui/material/Typography"
import Link from "next/link"


const LoginButtons = ({ setLoading, redirectUrl }: { setLoading: (value: boolean) => void, redirectUrl: string }) => {

	const providers = [{ name: "Connexion", id: "azure-ad" }];

	const LoginButton = ({ provider }: { provider: { name: string, id: string } }) => (
		<Button
			key={provider.id}
			onClick={() => {
				setLoading(true);
				signIn(provider.id, { callbackUrl: redirectUrl });
			}}
			variant="contained"
			color="primary">
			{provider.name}</Button>
	)

	return (
		<Stack pt={3}>
			{
				providers
					.map((provider: any) => (
						<LoginButton key={provider} provider={provider} />
					))
			}
		</Stack>
	);

}

const SignInPage = () => {

	const [loading, setLoading] = useState(false);
	let redirectUrl = "http://location:3000";

	useEffect(() => {
		const url = new URL(location.href);
		redirectUrl = url.searchParams.get("callbackUrl")!;
	});

	return (
		<Container maxWidth='xs'>
			<Grid container direction="column" alignItems="center" spacing={2}>
				<Grid item>
					<Image src={logo} alt="logo" width="300" height="300"
					/>
				</Grid>
				<Grid item maxWidth={'xs'} gap={2}>
					<Typography variant="subtitle1">Bienvenue sur l&apos;app de réservation des salles d&apos;étude des Chartreux !</Typography>
					{!loading ? <LoginButtons setLoading={setLoading} redirectUrl={redirectUrl} /> : <Typography variant="subtitle1">Chargement...</Typography>}
				</Grid>

				<Grid item textAlign={"center"} position={"fixed"} bottom={"10px"}>
					<Typography sx={{ fontStyle: 'italic' }} variant="caption">
						Made by <Link href="http://oui-code.fr" target="_blank" rel="noopener noreferrer">Oui-Code</Link>
					</Typography>
				</Grid>
			</Grid>
		</Container>

	)
}




export default SignInPage;
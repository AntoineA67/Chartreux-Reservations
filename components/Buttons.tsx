"use client";

import { getReservationsForDay } from "@/actions/Reservation.actions";
import { Box, Button, Link, Container } from "@mui/material";
import { signIn, signOut } from "next-auth/react";
import NextLink from "next/link";
import { useState } from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export function SignOutButton() {
	return (
		<button onClick={() => signOut()}>Déconnexion</button>
	);
}

export function ReservationButton() {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" variant="contained" color="primary">
			{pending ? "Ajout en cours..." : "Ajouter une réservation"}
		</Button>
	);
}

export const LoginButton = () => {
	return (
		<Button sx={{ margin: 10 }} variant="outlined" onClick={() => signIn("GitHub", { callbackUrl: '/' })}>
			Login
		</Button>
	);
};

export const RegisterButton = () => {
	return (
		<Button sx={{ margin: 10 }} variant="outlined">
			<Link sx={{ textDecoration: 'none' }} href="/register" component={NextLink} variant="button">
				Register
			</Link>
		</Button>
	);
};

export const LogoutButton = () => {
	return (
		<Button sx={{ margin: 10 }} variant="outlined" onClick={() => signOut()}>
			Sign Out
		</Button>
	);
};

export const ProfileButton = () => {
	return <Link sx={{ margin: 10 }} href="/profile">Profile</Link>;
};

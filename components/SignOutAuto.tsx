'use client';
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export function SignOutAuto() {
	useEffect(() => {
		signOut();
		redirect('/');
	}, []);
	return (
		<button onClick={() => signOut()}>Déconnexion</button>
	);
}
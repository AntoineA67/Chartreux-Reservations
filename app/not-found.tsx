import { Container, Typography } from '@mui/material'
import Link from 'next/link'

export default function NotFound() {
	return (
		<Container>
			<Typography variant="h1">Tu t&apos;es perdu je crois</Typography>
			<Link href="/">Clique ici</Link>
		</Container>
	)
}
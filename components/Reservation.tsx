'use client';
import { Grid, Card, CardContent, Typography, CardActions, Button } from "@mui/material";

export function Reservation({ date, id, roomName, deleteReservation }: { date: Date, id: string, roomName: string, deleteReservation: Function }) {
	return (
		<Grid width={1} item key={id} xs={12} sm={6} md={4}>
			<Card
				sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
			>
				<CardContent sx={{ flexGrow: 1 }}>
					<Typography gutterBottom variant="h5" component="h2">
						{date.toDateString()}
					</Typography>
					<Typography>
						{roomName}
					</Typography>
				</CardContent>
				<CardActions>
					<Button size="small" onClick={() => { deleteReservation(id) }}>Delete</Button>
					<Button size="small">Edit</Button>
				</CardActions>
			</Card>
		</Grid>
	);
}
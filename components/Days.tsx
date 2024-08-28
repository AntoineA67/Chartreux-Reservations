'use client'
import React from 'react'
import { Container, Grid, Typography } from '@mui/material';
import Day from './Day';
import { isSameWeek, nextMonday, startOfToday } from 'date-fns'
import { SnackbarProvider } from 'notistack';

export type DayType = {
	date: Date,
	rooms: {
		[name: string]: {
			name: string,
			capacity: number,
			capacityLeft: number,
		}
	},
	capacity: number,
	capacityLeft: number,
	userHasReservation: {
		reservationId: string,
		roomName: string,
	} | null,
}

export function Days({ days, rooms, actionWrapper, onResult }: { days: DayType[], rooms: any[], actionWrapper: any, onResult?: any }) {
	let addedThisWeek: boolean = false;
	let addedNextWeek: boolean = false;
	// console.log(days)
	return (
		<>
			<SnackbarProvider />
			<Container sx={{ pb: 4 }} maxWidth="xl">

				< Grid maxWidth={{ md: 'md', lg: 'lg' }} container rowSpacing={3} spacing={3} >
					{days.map((day: any, index: number) => {
						const date = day.date.toDateString();
						let label = null;
						if (!addedThisWeek && isSameWeek(day.date, startOfToday(), { weekStartsOn: 1 })) {
							label = "Cette semaine";
							addedThisWeek = true;
						} else if (!addedNextWeek && isSameWeek(day.date, nextMonday(new Date()), { weekStartsOn: 1 })) {
							label = "Semaine prochaine";
							addedNextWeek = true;
						}
						return (
							<React.Fragment key={date}>
								{label && (
									<Grid mb={-2} item xs={12}>
										<Typography variant="h5">
											{label}
										</Typography>
									</Grid>
								)}
								<Day onResult={onResult} ActionWrapper={actionWrapper} rooms={rooms} id={date} dayData={day as any} />
							</React.Fragment>
						);
					})}
				</Grid >
			</Container >
		</>
	)
}
'use client';
import { Grid, Card, CardContent, Typography, CardActions, Button, CardActionArea, Box } from "@mui/material";
import { DayType } from "./Days";
import ConfirmationDialog, { checkIsTooLate } from "./ConfirmationDialog";
import { useRef } from "react";
import moment from "moment";
import 'moment/locale/fr';
import theme from "@/lib/theme";
import { isToday } from "date-fns";

export default function Day({ dayData, id, rooms, ActionWrapper, onResult }: { dayData: DayType, id: string, rooms: string[], ActionWrapper: any, onResult?: any }) {
	// const ref = useRef<HTMLDivElement>(null);
	const isTooLate = checkIsTooLate(dayData.date);
	return (
		<Grid maxWidth={'xs'} item key={id} xs={12} sm={6} md={6} xl={6}>
			<Card elevation={12}
				sx={{
					borderRadius: 3, height: 150, display: 'flex', flexDirection: 'column', justifyContent: 'start'
				}}
			// ref={ref}
			>

				<ActionWrapper onResult={onResult} dayData={dayData} rooms={rooms} date={dayData.date}>
					{/* <ConfirmationDialog dayData={dayData} rooms={rooms} date={dayData.date} > */}

					<CardContent sx={{ height: "100%", width: "100%", display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
						<Box>

							<Typography mb={-1} textTransform={'capitalize'} variant="h4">
								{/* {dayData.date.toDateString()} */}
								{isToday(dayData.date) ? "Aujourd'hui" : moment(dayData.date).locale("fr").format('dddd')}
							</Typography>
							<Typography gutterBottom variant="h6">
								{moment(dayData.date).format('DD/MM')}
							</Typography>
							{isTooLate &&
								<Typography maxWidth={"50%"} position={'absolute'} bottom={12} variant="subtitle1" sx={{ fontStyle: 'italic' }} >
									Les réservations sont closes
								</Typography>
							}
						</Box>
						{dayData.userHasReservation ?
							<Box display={'flex'} flexDirection={'column'} alignItems={'center'}
								justifyContent={'center'} width={"40%"} p={1}
								borderRadius={2} bgcolor={isTooLate ? theme.palette.success.dark : theme.palette.success.main}>
								<Typography textAlign={'end'} >Salle réservée</Typography>
								<Typography textAlign={'end'} variant="h5" fontWeight={600} >{dayData.userHasReservation.roomName}</Typography>
							</Box> :
							<Box display={'flex'} flexDirection={'column'} alignItems={'center'}
								justifyContent={'center'} width={"40%"} p={1}
								borderRadius={2} bgcolor={isTooLate || dayData.capacityLeft === 0 ? theme.palette.info.dark : theme.palette.info.main}>
								<Typography textAlign={'center'} variant="h5" fontWeight={600} >{dayData.capacityLeft.toString()}</Typography>
								<Typography textAlign={'center'} >place{dayData.capacityLeft > 1 ? "s" : ""} restante{dayData.capacityLeft > 1 ? "s" : ""}</Typography>
							</Box>
						}
					</CardContent>
				</ActionWrapper>
				{/* </ConfirmationDialog> */}
				{/* <CardActions sx={{ display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-end" }}>
					{dayData.userHasReservation ?
						<ConfirmationDialogDelete dayData={dayData} /> :
						<ConfirmationDialog dayData={dayData} rooms={rooms} date={dayData.date} />
					}
				</CardActions> */}
			</Card>
		</Grid >
	);
}
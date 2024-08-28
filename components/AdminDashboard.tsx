'use client'
import { getReservationsForDay } from "@/actions/Reservation.actions";
import { Avatar, Box, Button, Card, CardActionArea, CardContent, CardMedia, Container, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Skeleton, Stack, Typography } from "@mui/material";
import { startTransition, useState, useTransition } from "react";
import CustomizedSnackbars from "./SimpleSnackbar";
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import ExportTable from "./DataGridPresentation";
import { format } from "date-fns";
import { ExcludedDays, Reservation, User } from "@prisma/client";
import { deleteProfileById, getProfileById } from "@/actions/Profile.actions";
import moment from "moment";
import { DayType, Days } from "./Days";
import ConfirmationDialog from "./ConfirmationDialog";
import React from "react";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import ExcludedDaysCalendar from "./ExcludedDaysCalendar";
import { setDefaultOptions } from 'date-fns';
import { fr } from 'date-fns/locale';

setDefaultOptions({ locale: fr });

export function StudCard({ loading, data }: { loading: boolean, data: Partial<User & { reservations: Reservation[] }> }) {
	// console.log(data)
	return (
		<>
			{loading ? <Skeleton variant="rectangular" width={300} height={400} /> :
				<Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems={'center'} justifyContent={'space-around'}>
					<Card sx={{ width: 300, height: 400 }}>
						{/* <CardActionArea> */}
						{data.image &&
							<CardMedia
								component="img"
								height="140"
								width="140"
								image={data.image}
							/>
						}
						<CardContent>
							<Typography gutterBottom variant="h5" component="div">
								{data.name}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{data.class}
								{data.email}
								{data.login}
							</Typography>
							<Button variant="contained" color="error" size="medium" onClick={async () => {
								const snackbarId = enqueueSnackbar('Suppression en cours...', {
									variant: 'info',
								})
								try {
									const res = await deleteProfileById(data.id as string);
									snackbarId && closeSnackbar(snackbarId)
									if (res.message === "success") {
										enqueueSnackbar('Profil supprimé !', {
											variant: 'success',
										})
									} else throw new Error("Oups, une erreur est survenue !");
								} catch (e) {
									console.log("got error !", e)
									snackbarId && closeSnackbar(snackbarId)
									enqueueSnackbar('Oups, une erreur est survenue !', {
										variant: 'error',
									})
								}
							}}>Supprimer le profil</Button>
						</CardContent>
						{/* </CardActionArea> */}
					</Card>
					<List sx={{ minWidth: 200, flexDirection: 'column', bgcolor: 'background.paper' }}>
						{data.reservations &&
							data.reservations.map((r, i) => (
								<>
									<ListItem sx={{ pl: 2 }} key={i} disablePadding>
										<ListItemText primary={moment(r.date).format("DD/MM/YYYY")} secondary={r.roomName} />
									</ListItem>
									<Divider variant="fullWidth" component="li" />
								</>
							))
						}
					</List>
				</Stack>
			}
		</>
	)
}

export function ReservationsForDay({ dayData, children, onResult }: { dayData: DayType, children: any, onResult: any }) {
	return (
		<>
			{/* < Button disabled={isToday(dayData.date) && isAfter(new Date(), new Date(new Date().setHours(19, 0, 0, 0)))} variant="contained" color="error" size="medium" onClick={handleClickOpen}>Supprimer</Button > */}
			<CardActionArea sx={{ height: "100%", width: "100%" }} disabled={false}
				onClick={async (formData) => {
					startTransition(() => {
						if (!formData) return
						try {
							const x = async () => {
								const res = await getReservationsForDay(null, format(dayData.date as Date, 'yyyy-MM-dd'));
								return res
							}
							const res = x().then((res) => {
								onResult({ message: { message: res.message, rdm: Math.random() }, result: res.data })
							});
						} catch (e) {
							console.log("got error !", e)
							onResult({ message: { message: "oups", rdm: Math.random() }, result: null })
						}
					})
				}}>
				{children}
			</CardActionArea >
		</>
	);
}

export default function AdminDashboard({ studs, days, rooms, excludedDays }: { studs: Partial<User>[], days: DayType[], rooms: string[], excludedDays: Partial<ExcludedDays>[] }) {
	// const router = useRouter();
	const [message, setMessage] = useState<{ message: string, rdm: number }>({ message: "", rdm: Math.random() });
	const [isPending, startTransition] = useTransition();
	const [result, setResult] = useState<any[] | null>(null);
	const [stud, setStud] = useState<Partial<User & { reservations: Reservation[] }> | null>(null);
	const [pendingStud, startPendingStud] = useTransition();
	const error = console.error;
	console.error = (...args: any) => {
		if (/defaultProps/.test(args[0])) return;
		error(...args);
	};

	return (
		<>
			<CustomizedSnackbars message={message} />
			<Container maxWidth={'xl'} >
				<Stack mx={2} spacing={3} direction={{ sm: 'column', md: 'row' }} alignItems={'center'} justifyContent={'space-around'}>
					{/* <Stack gap={1} maxWidth={300}> */}
					{/* <Box> */}
					<Days onResult={(result: any) => {
						setMessage(result.message);
						setResult(result.result);
						// console.log(result)
					}} actionWrapper={ReservationsForDay} days={days} rooms={rooms} />
					{/* </Box> */}
					<Box maxWidth={300}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<DateCalendar disabled={isPending} onChange={async (formData) => {
								startTransition(async () => {
									if (!formData) return
									try {
										// console.log(formData)
										// new Date(formData.get('date') as string);
										const res = await getReservationsForDay(null, format(formData as Date, 'yyyy-MM-dd'));
										// console.log("changed message")
										setMessage({ message: res.message, rdm: Math.random() });
										setResult(res.data);
									} catch (e) {
										console.log("got error !", e)
										setMessage({ message: "oups", rdm: Math.random() });
										setResult(null);
									}
								})
							}} />
						</LocalizationProvider >
					</Box>
					{/* </Stack> */}
				</Stack >
				{result && <ExportTable loading={isPending} data={result} />}

				<ExcludedDaysCalendar excludedDays={excludedDays} />

				{/* <Stack mx={2} spacing={3} direction={{ sm: 'column', md: 'row' }} alignItems={'center'} justifyContent={'space-around'}>
					<Box maxWidth={400}>
						<List sx={{ flexDirection: 'column', bgcolor: 'background.paper' }}>
							{studs &&
								studs.map((stud, i) => (
									<ListItem key={i} disablePadding>
										<ListItemButton onClick={
											async (formData) => {
												startPendingStud(async () => {
													if (!formData) return
													try {
														const res = await getProfileById(formData.currentTarget.id as string);
														setMessage({ message: res.message, rdm: Math.random() });
														setStud(res.data);
													} catch (e) {
														console.log("got error !", e)
														setMessage({ message: "oups", rdm: Math.random() });
														setStud(null);
													}
												})
											}

										} id={stud.id} >
											{stud.image &&
												<ListItemAvatar>
													<Avatar src={stud.image} />
												</ListItemAvatar>
											}
											<ListItemText primary={stud.name} />
										</ListItemButton>
									</ListItem>
								))
							}
						</List>
					</Box>
					{stud && <StudCard loading={pendingStud} data={stud} />}
				</Stack > */}

			</Container >
		</>
	)
}
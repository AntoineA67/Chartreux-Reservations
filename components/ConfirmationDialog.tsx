'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { addReservation, deleteReservation } from '@/actions/Reservation.actions';
import { CardActionArea, DialogContentText, Stack, Typography } from '@mui/material';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { DayType } from './Days';
import moment from 'moment';
import theme from '@/lib/theme';


export interface ConfirmationDialogRawProps {
	id: string;
	keepMounted: boolean;
	value: string;
	open: boolean;
	rooms: {
		name: string;
		capacity: number;
		capacityLeft: number;
	}[];
	date: Date;
	onClose: (value?: string) => void;
}

const colorForCapacity = (capacity: number, capacityLeft: number) => {
	if (capacityLeft === 0) return theme.palette.error.main
	return capacityLeft > (capacity / 4) ? theme.palette.success.main : theme.palette.warning.main
}

const RoomListElement = ({ room }: { room: any }) => {
	return (
		// <Stack width={"100%"} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
		<FormControlLabel
			value={room.name}
			key={room.name}
			control={<Radio />}
			disableTypography={true}
			label={
				<Stack alignItems={'center'} justifyContent={'space-between'} direction='row' width={"100%"}>
					<Typography textAlign={'left'} alignSelf={'start'} >
						{room.name}
					</Typography>
					<Typography color={colorForCapacity(room.capacity, room.capacityLeft)} pr={3} textAlign={'right'} alignSelf={'end'} variant="body2" ml={3}>
						{room.capacity - room.capacityLeft} / {room.capacity}
						{/* {room.capacityLeft} places restantes */}
					</Typography>
				</Stack>
			}
			disabled={room.capacityLeft === 0}
			sx={{ minWidth: "100%", mr: 0, pl: 3 }}
		/>
		// </Stack>
	);
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
	const { onClose, value: valueProp, open, ...other } = props;
	const [value, setValue] = React.useState(valueProp);
	const radioGroupRef = React.useRef<HTMLElement>(null);
	// const [rooms, setRooms] = React.useState<any[]>([]);

	React.useEffect(() => {
		if (!open) {
			setValue(valueProp);
		}
	}, [valueProp, open]);

	const handleEntering = () => {
		if (radioGroupRef.current != null) {
			radioGroupRef.current.focus();
		}
	};

	const handleCancel = () => {
		onClose();
	};

	const handleOk = () => {
		onClose(value);
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue((event.target as HTMLInputElement).value);
	};

	// React.useEffect(() => {
	// 	console.log('props.rooms', props.rooms)
	// 	setRooms(props.rooms);
	// }, [props.rooms]);

	return (
		<Dialog
			sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
			maxWidth="xs"
			TransitionProps={{ onEntering: handleEntering }}
			open={open}
			{...other}
		>
			<DialogTitle textTransform={'capitalize'} fontSize={24}>{

				moment(props.date).locale('fr').format('dddd DD/MM')

			}</DialogTitle>
			<DialogContent sx={{ p: 0 }}>
				<DialogContentText mb={2} ml={3}>
					Choisissez une salle
				</DialogContentText>
				<RadioGroup
					ref={radioGroupRef}
					aria-label="salle"
					name="salle"
					value={value}
					onChange={handleChange}

				>
					{props.rooms.map((room) => (
						<RoomListElement key={room.name} room={room} />
					))}
				</RadioGroup>
			</DialogContent>
			<DialogActions>
				<Button color="info" autoFocus onClick={handleCancel}>
					Annuler
				</Button>
				<Button color="primary" variant='contained' onClick={handleOk}>Réserver</Button>
			</DialogActions>
		</Dialog>
	);
}

export function ConfirmationDialogAdd({ dayData, rooms, date, children }: { dayData: DayType, rooms: string[], date: Date, children: any }) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState('');
	const [swipeProgress, setSwipeProgress] = React.useState(0);

	const handleClickListItem = () => {
		setOpen(true);
	};

	const handleClose = async (newValue?: string) => {
		setOpen(false);

		if (newValue) {
			// setValue(newValue);
			const snackbarId = enqueueSnackbar('Ajout en cours...', {
				variant: 'info',
			})
			try {
				const res = await addReservation(date, newValue);
				snackbarId && closeSnackbar(snackbarId)
				if (res.message === "success") {
					enqueueSnackbar('Réservation ajoutée !', {
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
		}
	};

	return (
		<>
			<CardActionArea sx={{ height: "100%", width: "100%" }} disabled={checkIsTooLate(dayData.date) || dayData.capacityLeft === 0} onClick={() => {
				handleClickListItem();
			}}>

				{children}

			</CardActionArea >
			<ConfirmationDialogRaw
				id="ringtone-menu"
				keepMounted
				open={open}
				onClose={handleClose}
				value={value}
				date={date}
				rooms={Object.values(dayData.rooms)}
			/>
		</>
	);
}

export default function ConfirmationDialog({ dayData, rooms, date, children }: { dayData: DayType, rooms: string[], date: Date, children: any }) {

	return (
		<>
			{dayData.userHasReservation ?
				<ConfirmationDialogDelete dayData={dayData} >{children}</ConfirmationDialogDelete> :
				<ConfirmationDialogAdd dayData={dayData} rooms={rooms} date={date} >{children}</ConfirmationDialogAdd>}
		</>
	)
}

export const checkIsTooLate = (date: Date) => {
	return moment().isAfter(moment(date.setHours(19)))
}


export function ConfirmationDialogDelete({ dayData, children }: { dayData: DayType, children: any }) {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = async (oui: boolean) => {
		// console.log('oui', oui, dayData.userHasReservation?.reservationId)
		if (oui && dayData.userHasReservation?.reservationId) {
			// console.log("deleting")

			const snackbarId = enqueueSnackbar('Suppression en cours...', {
				variant: 'info',
			})
			try {
				const res = await deleteReservation(dayData.userHasReservation?.reservationId)
				snackbarId && closeSnackbar(snackbarId)
				if (res.message === "success") {
					enqueueSnackbar('Réservation supprimée !', {
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
		}
		setOpen(false);
	}

	return (
		<>
			<CardActionArea sx={{ height: "100%", width: "100%" }} disabled={checkIsTooLate(dayData.date)}
				onClick={handleClickOpen}>
				{children}

			</CardActionArea >
			<Dialog
				open={open}
				onClose={() => { handleClose(false) }}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					Suppression
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Es-tu sûr de vouloir supprimer ta réservation ?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => { handleClose(false) }}>Annuler</Button>
					<Button onClick={() => { handleClose(true) }} autoFocus>
						Oui
					</Button>
				</DialogActions>
			</Dialog >
		</>
	);
}
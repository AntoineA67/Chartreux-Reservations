'use client';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref,
) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export interface SnackbarMessage {
	message: string;
	key: number;
}

type CustomizedSnackbarsProps = {
	message: { message: string, rdm: number } | null;
}

export default function CustomizedSnackbars(props: CustomizedSnackbarsProps) {
	const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]);
	const [open, setOpen] = React.useState(false);
	const [messageInfo, setMessageInfo] = React.useState<SnackbarMessage | undefined>(
		undefined,
	);
	const [rdm, setRdm] = React.useState<number | null>(null);

	const handleExited = () => {
		setMessageInfo(undefined);
	};

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen(false);
	};
	React.useEffect(() => {
		if (props.message?.message && props.message.rdm != rdm) {
			setRdm(props.message.rdm);
		}
	}, [props.message]);

	React.useEffect(() => {
		if (!rdm) return;
		setOpen(true);
		setSnackPack((prev) => [...prev, { message: props.message?.message as string, key: new Date().getTime() }]);
	}, [rdm]);


	React.useEffect(() => {
		if (snackPack.length && !messageInfo) {
			// Set a new snack when we don't have an active one
			setMessageInfo({ ...snackPack[0] });
			setSnackPack((prev) => prev.slice(1));
			setOpen(true);
		} else if (snackPack.length && messageInfo && open) {
			// Close an active snack when a new one is added
			setOpen(false);
		}
	}, [snackPack, messageInfo, open]);

	return (
		<>
			<Snackbar
				key={messageInfo ? messageInfo.key : undefined}
				open={open}
				autoHideDuration={3000}
				onClose={handleClose}
				TransitionProps={{ onExited: handleExited }}
				message={messageInfo ? messageInfo.message : undefined}
				action={
					<React.Fragment>
						<IconButton
							aria-label="close"
							color="inherit"
							sx={{ p: 0.5 }}
							onClick={handleClose}
						>
							<CloseIcon />
						</IconButton>
					</React.Fragment>
				}
			/>
		</>
		// <Stack spacing={2} sx={{ width: '100%' }}>
		// 	{/* <Button variant="outlined" onClick={handleMessage}>
		// 		Open success snackbar
		// 	</Button> */}
		// 	<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
		// 		<Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
		// 			This is a success message!
		// 		</Alert>
		// 	</Snackbar>
		// 	<Alert severity="error">This is an error message!</Alert>
		// 	<Alert severity="warning">This is a warning message!</Alert>
		// 	<Alert severity="info">This is an information message!</Alert>
		// 	<Alert severity="success">This is a success message!</Alert>
		// </Stack>
	);
}

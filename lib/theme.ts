import { Roboto, Titillium_Web } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
});

const titillium_Web = Titillium_Web({
	weight: ['300', '400', '600', '700'],
	subsets: ['latin'],
	display: 'swap',
});

const theme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#1976d2',
		},
		secondary: {
			main: '#9c27b0',
		},
		background: {
			paper: '#EFF7FF', // your color
		},
	},
	typography: {
		h2: {
			fontWeight: 400,
		},
		fontFamily: roboto.style.fontFamily,
	},
	components: {
		MuiDialogTitle: {
			styleOverrides: {
				// Name of the slot
				root: {
					// Some CSS
					paddingBottom: '0px',
				},
			},
		},
		MuiAlert: {
			styleOverrides: {
				root: ({ ownerState }) => ({
					...(ownerState.severity === 'info' && {
						// backgroundColor: '#60a5fa',
					}),
				}),
			},
		},
	},
});

export default theme;
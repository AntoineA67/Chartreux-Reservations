'use client';
import * as React from 'react';
import Badge from '@mui/material/Badge';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import moment, { now } from 'moment';
import { ExcludedDays } from '@prisma/client';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isSameMonth } from 'date-fns';
import { startTransition, useTransition } from 'react';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { invertDayExclusion } from '@/actions/Reservation.actions';

function ServerDay(props: PickersDayProps<Date> & { highlightedDays?: number[] }) {
	const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

	const isSelected =
		!props.outsideCurrentMonth && highlightedDays.indexOf(props.day.getDate()) >= 0;

	return (
		// <Badge
		// 	key={props.day.toString()}
		// 	overlap="circular"
		// 	badgeContent={isSelected ? '🌚' : undefined}
		// >
		<PickersDay sx={{ backgroundColor: isSelected ? 'orange' : undefined }} {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
		// </Badge>
	);
}

export default function ExcludedDaysCalendar({ excludedDays }: { excludedDays: Partial<ExcludedDays>[] }) {
	// const [isLoading, setIsLoading] = React.useState(true);
	const [highlightedDays, setHighlightedDays] = React.useState<Partial<ExcludedDays>[]>([]);
	const [viewMonth, setViewMonth] = React.useState(new Date());
	const [isPending, startTransition] = useTransition();

	const formatDays = (days: Partial<ExcludedDays>[], date: Date) => {
		return days ? days.map((day: any) => day.date ? (isSameMonth(date, day.date) ? (day.date?.getDate() ?? -1) : -1) : -1) : []
	}

	// const fetchHighlightedDays = (date: any) => {
	// 	setHighlightedDays(excludedDays.map((day) => day.date ? (isSameMonth(date, day.date) ? (day.date?.getDate() ?? -1) : -1) : -1));
	// 	setIsLoading(false);
	// 	console.log(excludedDays.map((day) => day.date?.getDate() ?? -1))
	// };

	React.useEffect(() => {
		// fetchHighlightedDays(moment());
		setHighlightedDays(formatDays(excludedDays as Partial<ExcludedDays>[], new Date()));
		// setHighlightedDays(excludedDays.map((day) => day.date ? (isSameMonth(new Date(), day.date) ? (day.date?.getDate() ?? -1) : -1) : -1));
	}, []);

	const handleMonthChange = (date: Date) => {
		// setIsLoading(true);
		setViewMonth(date);
		setHighlightedDays(formatDays(excludedDays as Partial<ExcludedDays>[], date));
		// setHighlightedDays(excludedDays.map((day) => day.date ? (isSameMonth(date, day.date) ? (day.date?.getDate() ?? -1) : -1) : -1));

		// setHighlightedDays([]);
		// fetchHighlightedDays(date);
	};

	return (
		<>
			<SnackbarProvider />
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<DateCalendar
					// loading={isLoading}
					onMonthChange={handleMonthChange}
					renderLoading={() => <DayCalendarSkeleton />}
					slots={{
						day: ServerDay,
					}}
					slotProps={{
						day: {
							highlightedDays: highlightedDays,
						} as any,
					}}
					disabled={isPending}
					onChange={(formData) => {
						startTransition(async () => {
							if (!formData) return
							try {
								console.log(formData)
								// new Date(formData.get('date') as string);
								const res = await invertDayExclusion(format(formData as Date, 'yyyy-MM-dd'));
								console.log(res)
								setHighlightedDays(formatDays(res.data as Partial<ExcludedDays>[], viewMonth));
								enqueueSnackbar('Date mise à jour', {
									variant: 'success',
								})
								// setHighlightedDays(excludedDays.map((day) => day.date ? (isSameMonth(new Date(), day.date) ? (day.date?.getDate() ?? -1) : -1) : -1));
								// console.log("changed message")
								// setMessage({ message: res.message, rdm: Math.random() });
								// setResult(res.data);
							} catch (e) {
								console.log("got error !", e)
								enqueueSnackbar('Oups, une erreur est survenue !', {
									variant: 'error',
								})
								// setMessage({ message: "oups", rdm: Math.random() });
								// setResult(null);
							}
						})
					}}
				/>
			</LocalizationProvider>
		</>
	);
}
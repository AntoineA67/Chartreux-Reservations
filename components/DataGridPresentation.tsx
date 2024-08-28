'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
	DataGrid,
	GridColDef,
	GridToolbarContainer,
	GridToolbarExport,
	useGridApiRef,
} from '@mui/x-data-grid';

interface DataGridDemoProps {
	data: any;
	loading: boolean;
}

function CustomToolbar() {
	return (
		<GridToolbarContainer>
			<GridToolbarExport
				printOptions={{
					hideFooter: true,
					hideToolbar: true,
				}}
				csvOptions={
					{ disableToolbarButton: true }
				}
			/>

		</GridToolbarContainer>
	);
}

export default function ExportTable(props: DataGridDemoProps) {
	const apiRef = useGridApiRef();
	const columns: GridColDef[] = [
		{ field: 'name', headerName: 'Nom et Prénom', resizable: true, flex: 4, maxWidth: 300 },
		{ field: 'class', headerName: 'Classe', resizable: true, flex: 1, maxWidth: 100 },
		{ field: 'room', headerName: 'Salle', resizable: true, flex: 1, maxWidth: 100 },
		{ field: 'here', headerName: 'Présent(e)', resizable: true, flex: 1, maxWidth: 100 },
		// { field: 'name', headerName: 'Prénom et Nom', width: 300, resizable: true },
		// { field: 'class', headerName: 'Classe', width: 50, resizable: true },
		// { field: 'room', headerName: 'Salle', width: 50, resizable: true },
		// { field: 'here', headerName: 'Présent(e)', width: 50, resizable: true },
	];
	const rows = props.data.map((row: any, index: number) => {
		return { id: index, name: row.user.name ?? row.user.email, class: row.user.class, room: row.roomName }
	});

	// React.useEffect(() => {
	// 	console.log(props.data)
	// }, []);
	return (
		<div style={{ height: 300, width: "100%" }}>
			<DataGrid
				localeText={{ toolbarExportPrint: 'Imprimer' }}
				density='compact'
				sx={{ minHeight: 200 }}
				pageSizeOptions={[25, 50, 100]}
				apiRef={apiRef}
				loading={props.loading}
				disableRowSelectionOnClick
				rows={rows}
				columns={columns}
				slots={{
					toolbar: CustomToolbar,
				}}
			/>
		</div>

	);
}

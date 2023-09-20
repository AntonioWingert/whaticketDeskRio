import { Button, ButtonGroup, Dialog, DialogActions, DialogTitle, TextField, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
	root: {
	},
	statusDiv: {
		width: "10px",
		height: "10px",
		borderRadius: "50%",
		marginRight: "10px",
	},
}));

const StatusModal = ({
	currentStatus,
	onClose, open,
	handleStatusChange,
	setAwayMessage,
	setOfflineMessage,
	handleStatusSubmit,
	awayMessage = '',
	offlineMessage = ''
}) => {
	const classes = useStyles();
	const status = currentStatus.toLowerCase();

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			scroll="paper"
		>
			<DialogTitle>
				Alterar Status
			</DialogTitle>
			<ButtonGroup
				orientation='vertical'
			>
				<Button
					variant={status === 'online' ? 'contained' : 'outlined'}
					onClick={() => handleStatusChange('online')}
				>
					<div className={classes.statusDiv} style={{
						backgroundColor: "#00ff00"
					}} />
					Online
				</Button>
				<Button
					variant={status === 'em pausa' ? 'contained' : 'outlined'}
					onClick={() => handleStatusChange('em pausa')}
				>
					<div className={classes.statusDiv} style={{
						backgroundColor: "#ffcc00"
					}} />
					Em pausa
				</Button>
				<Button
					variant={status === 'offline' ? 'contained' : 'outlined'}
					onClick={() => handleStatusChange('offline')}
				>
					<div className={classes.statusDiv} style={{
						backgroundColor: "#ff0000"
					}} />
					Offline
				</Button>
			</ButtonGroup>
			<TextField
				label="Mensagem para status em pausa" variant='outlined'
				value={awayMessage}
				onChange={(e) => setAwayMessage(e.target.value)} />
			<TextField
				label="Mensagem para status offline" variant='outlined'
				value={offlineMessage}
				onChange={(e) => setOfflineMessage(e.target.value)} />

			<DialogActions>
				<Button
					type="submit"
					color="primary"
					variant="contained"
					onClick={handleStatusSubmit ? handleStatusSubmit : onClose}
				>
					Alterar
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default StatusModal;
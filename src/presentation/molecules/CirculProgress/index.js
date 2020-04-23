import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import './style.css';

const CirculProgress = ({ open, size }) => (
	<Dialog
		disableBackdropClick
		disableEscapeKeyDown
		open={open}
		PaperProps={{
			style: {
				backgroundColor: 'transparent',
				boxShadow: 'none',
				height: '300px',
				minHeight: '300px',
				maxHeight: '300px',
				width: '300px',
				minWidth: '300px',
				maxWidth: '300px'
			}
		}}>
		<DialogContent>
			<CircularProgress size={size} color='primary' />
		</DialogContent>
	</Dialog>
)
export default CirculProgress;
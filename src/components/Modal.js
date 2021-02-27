import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

export default function TransitionsModal(props) {
    const { closable } = props
    const classes = useStyles();
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        if (closable) setOpen(false);
    };

    return (
        <Modal
            className={classes.modal}
            open={open}
            closeAfterTransition
            BackdropComponent={Backdrop}
            onClose={handleClose}
            BackdropProps={{
                timeout: 500,
            }}
            disableAutoFocus
        >
            <Fade in={open}>
                {props.children}
            </Fade>
        </Modal>
    );
}
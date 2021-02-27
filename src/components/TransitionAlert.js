import {makeStyles} from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import React, {useState} from "react";
import {AlertVariants, displayAlert} from "../actions/alert";
import {connect} from "react-redux";
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

const TransitionAlert = props => {
    const { alertText, alertVariant } = props
    const classes = useStyles();

    const handleClose = () => {
        props.closeAlert();
    };

    return (
        <Modal
            className={classes.modal}
            open={alertText !== null && alertVariant !== null}
            BackdropComponent={Backdrop}
            onClose={handleClose}
            BackdropProps={{
                timeout: 500,
            }}
            disableAutoFocus
        >
            {alertText !== null && alertVariant !== null ?
                <Fade in>
                    <Alert severity={alertVariant} style={{outline: '0'}}>{alertText}</Alert>
                </Fade>
                :
                <div></div>
            }

        </Modal>
    );
};

const mapStateToProps = state => ({
    alertText: state.alertText,
    alertVariant: state.alertVariant
});

const mapDispatchToProps = dispatch => ({
    closeAlert: () => {
        dispatch(displayAlert(null, null));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(TransitionAlert);
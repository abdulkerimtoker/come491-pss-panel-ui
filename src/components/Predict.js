import {useEffect, useState} from "react";
import httpclient from "../httpclient";
import {receivePerson, receivePersonModuleAccess, receivePersonPictures} from "../actions/person";
import {connect} from "react-redux";
import {
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
    Typography
} from "@material-ui/core";
import {useParams} from "react-router";
import {Alert, Autocomplete} from "@material-ui/lab";
import TransitionsModal from "./Modal";
import {showAlert} from "../alerter";
import {AlertVariants, displayAlert} from "../actions/alert";
import {makeStyles} from "@material-ui/core/styles";
import {receiveModules} from "../actions/module";

const styles = makeStyles(theme => ({
    container: {
        padding: '25px',
        marginBottom: '25px'
    },
    divider: {
        marginTop: '25px'
    },
    tableHeadRow: {
        fontWeight: 'bolder'
    }
}));

const Predict = props => {
    const classes = styles();
    const [picture, setPicture] = useState(null);

    const handleChangePicture = event => {
        let file = event.target.files ? event.target.files[0] : null;
        setPicture(file);
    };

    const handlePredict = () => {
        if (picture) {
            props.predict(picture);
        }
    };

    return (
        <div>
            <Grid container component={Paper} className={classes.container}>
                <Grid item xs={12}>
                    <Typography variant="h5">Predict</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Input type="file" onChange={handleChangePicture} />
                    <Button variant="contained" color="primary" onClick={handlePredict}>Upload</Button>
                </Grid>
            </Grid>
        </div>
    );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
    predict: (picture) => {
        let form = new FormData();
        form.append('file', picture, 'picture');
        let request = httpclient.fetch(`/api/check/1`, {
            method: 'POST',
            body: form
        }).then(resp => resp.json())
            .then(p => showAlert(AlertVariants.SUCCESS, JSON.stringify(p)));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Predict);
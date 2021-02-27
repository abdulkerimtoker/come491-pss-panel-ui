import {useEffect, useState} from "react";
import httpclient from "../httpclient";
import {receivePerson, receivePersonPictures} from "../actions/person";
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
import {receiveSignals} from "../actions/signals";
import {receiveModule} from "../actions/module";

const styles = makeStyles(theme => ({
    container: {
        padding: '25px',
        marginBottom: '25px'
    },
    divider: {
        marginTop: '25px'
    }
}));

const Module = props => {
    const { fetchedModule, signals } = props;
    const { id } = useParams();
    const classes = styles();
    const [module, setModule] = useState(null);

    useEffect(() => {
        props.fetchModule(id);
        props.fetchSignals();
    }, [id]);

    useEffect(() => {
        if (fetchedModule) setModule(Object.assign({}, fetchedModule));
    }, [fetchedModule]);

    const handleChangeField = (field, event) => setModule(Object.assign({}, module, {[field]: event.target.value}));

    const handleChangeSignal = (_, value) => setModule(Object.assign({}, module, {signal: value}));

    const handleSaveChanges = () => props.updateModule(module);

    return (
        <div>
            {module &&
            <Grid container component={Paper} className={classes.container}>
                <Grid item xs={12}>
                    <Typography variant="h5">Manage {module.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel htmlFor="module-name">Name</InputLabel>
                        <Input
                            id="module-name"
                            type="text"
                            name="name"
                            value={module.name}
                            onChange={handleChangeField.bind(null, 'name')}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel htmlFor="module-desc">Description</InputLabel>
                        <Input
                            id="module-desc"
                            type="text"
                            name="name"
                            value={module.description}
                            onChange={handleChangeField.bind(null, 'description')}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormHelperText>Signal</FormHelperText>
                    <Autocomplete
                        options={signals ? signals : []}
                        value={module.signal}
                        getOptionLabel={signal => `${signal.id} - ${signal.name}`}
                        getOptionSelected={(option, value) => option.id === value.id}
                        onChange={handleChangeSignal}
                        renderInput={params => <TextField {...params} />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSaveChanges}>Save Changes</Button>
                </Grid>
            </Grid>
            }
        </div>
    );
};

const mapStateToProps = state => ({
    fetchedModule: state._module,
    signals: state.signals
});

const mapDispatchToProps = dispatch => ({
    fetchModule: id => {
        httpclient.fetch(`/api/modules/${id}`)
            .then(resp => resp.json())
            .then(_module => dispatch(receiveModule(_module)));
    },

    updateModule: _module => {
        httpclient.fetch(`/api/modules/${_module.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(_module)
        }).then(resp => {
            if (resp.status === 200) showAlert(AlertVariants.SUCCESS, 'success!!');
        })
    },

    fetchSignals: () => {
        httpclient.fetch('/api/signals')
            .then(resp => resp.json())
            .then(signals => dispatch(receiveSignals(signals)));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Module);
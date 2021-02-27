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
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography
} from "@material-ui/core";
import {useParams} from "react-router";
import {showAlert} from "../alerter";
import {AlertVariants, displayAlert} from "../actions/alert";
import {makeStyles} from "@material-ui/core/styles";
import {receiveSignal, receiveSignalSteps} from "../actions/signals";

const styles = makeStyles(theme => ({
    container: {
        padding: '25px',
        marginBottom: '25px'
    },
    divider: {
        marginTop: '25px'
    },
    headerCell: {
        fontWeight: 'bold'
    }
}));

const Signal = props => {
    const { fetchedSignal, fetchedSteps } = props;
    const { id } = useParams();
    const classes = styles();
    const [signal, setSignal] = useState(null);
    const [steps, setSteps] = useState(null);
    const [step, setStep] = useState({step: 0, bits: 0});

    useEffect(() => {
        props.fetchSignal(id);
        props.fetchSignalSteps(id);
    }, [id]);

    useEffect(() => {
        if (fetchedSignal) setSignal(Object.assign({}, fetchedSignal));
    }, [fetchedSignal]);

    useEffect(() => {
        if (fetchedSteps) setSteps([...fetchedSteps]);
    }, [fetchedSteps]);

    const handleChangeField = (field, event) => setSignal(Object.assign({}, signal, {[field]: event.target.value}));

    const handleSaveChanges = () => props.updateSignal(signal);

    const handleChangeStepToAddField = (field, event) => setStep(Object.assign({}, step, {[field]: parseInt(event.target.value)}));

    const handleCreateStep = () => props.createSignalStep(id, step, () => props.fetchSignalSteps(id));

    const handleChangeStepField = (stepId, field, event) => {
        setSteps(
            steps.map(s => s.id === stepId ? Object.assign({}, s, {[field]: parseInt(event.target.value)}) : s)
        );
    };

    const handleSaveStepChange = step => props.updateSignalStep(step);

    const handleDeleteStep = stepId => props.deleteSignalStep(stepId, () => props.fetchSignalSteps(id));

    return (
        <div>
            {signal &&
            <Grid container component={Paper} className={classes.container}>
                <Grid item xs={12}>
                    <Typography variant="h5">Manage {signal.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel htmlFor="signal-name">Name</InputLabel>
                        <Input
                            id="signal-name"
                            type="text"
                            value={signal.name}
                            onChange={handleChangeField.bind(null, 'name')}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel htmlFor="signal-desc">Description</InputLabel>
                        <Input
                            id="signal-desc"
                            type="text"
                            value={signal.description}
                            onChange={handleChangeField.bind(null, 'description')}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSaveChanges}>Save Changes</Button>
                </Grid>
            </Grid>
            }

            <Grid container component={Paper} className={classes.container}>
                <Grid item xs={12}>
                    <Typography variant="h5">Add Step</Typography>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel htmlFor="step-step">Step</InputLabel>
                        <Input
                            id="step-step"
                            type="number"
                            value={step.step}
                            onChange={handleChangeStepToAddField.bind(null, 'step')}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel htmlFor="step-step">Bits</InputLabel>
                        <Input
                            id="step-bits"
                            type="number"
                            value={step.bits}
                            onChange={handleChangeStepToAddField.bind(null, 'bits')}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleCreateStep}>Add</Button>
                </Grid>
            </Grid>

            {steps &&
            <TableContainer component={Paper} className={classes.container}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.headerCell}>ID</TableCell>
                            <TableCell className={classes.headerCell}>Step</TableCell>
                            <TableCell className={classes.headerCell}>Bits</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {steps.sort((a, b) => a.step - b.step).map(step =>
                            <TableRow key={step.id.toString()}>
                                <TableCell>{step.id}</TableCell>
                                <TableCell>
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel htmlFor={`step-${step.id}-step`}>Step</InputLabel>
                                        <Input
                                            id={`step-${step.id}-step`}
                                            type="number"
                                            value={step.step}
                                            onChange={handleChangeStepField.bind(null, step.id, 'step')}
                                            onBlur={handleSaveStepChange.bind(null, step)}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <FormControl fullWidth margin="dense">
                                        <InputLabel htmlFor={`step-${step.id}-bits`}>Bits</InputLabel>
                                        <Input
                                            id={`step-${step.id}-bits`}
                                            type="number"
                                            value={step.bits}
                                            onChange={handleChangeStepField.bind(null, step.id, 'bits')}
                                            onBlur={handleSaveStepChange.bind(null, step)}
                                        />
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained" color="primary"
                                        onClick={handleDeleteStep.bind(null, step.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            }
        </div>
    );
};

const mapStateToProps = state => ({
    fetchedSignal: state.signal,
    fetchedSteps: state.signalSteps
});

const mapDispatchToProps = dispatch => ({
    fetchSignal: id => {
        httpclient.fetch(`/api/signals/${id}`)
            .then(resp => resp.json())
            .then(signal => dispatch(receiveSignal(signal)));
    },

    updateSignal: signal => {
        httpclient.fetch(`/api/signals/${signal.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(signal)
        }).then(resp => {
            if (resp.status === 200) showAlert(AlertVariants.SUCCESS, 'success!!');
        });
    },

    fetchSignalSteps: signalId => {
        httpclient.fetch(`/api/signals/${signalId}/steps`)
            .then(resp => resp.json())
            .then(steps => dispatch(receiveSignalSteps(steps)));
    },

    createSignalStep: (signalId, step, callback) => {
        let request = httpclient.fetch(`/api/signals/${signalId}/steps`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(step)
        });
        if (callback) request.then(callback);
    },

    updateSignalStep: (step, callback) => {
        let request = httpclient.fetch(`/api/signals/steps/${step.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(step)
        });
        if (callback) request.then(callback);
    },

    deleteSignalStep: (stepId, callback) => {
        let request = httpclient.fetch(`/api/signals/steps/${stepId}`, {method: 'DELETE'});
        if (callback) request.then(callback);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Signal);
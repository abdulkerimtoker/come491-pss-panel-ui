import {makeStyles} from "@material-ui/core/styles";
import {Button, FormControl, Grid, Input, InputLabel, Paper} from "@material-ui/core";
import TransitionsModal from "./Modal";
import httpclient from "../httpclient";
import {connect} from "react-redux";
import {logIn} from "../actions/security";
import {useState} from "react";

const styles = makeStyles(theme => ({
    form: {
        maxWidth: '330px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
        padding: '20px',
        marginTop: '30px',
        border: '0',
        outline: '0'
    },

    button: {
        marginTop: '25px'
    }
}));

const Login = (props) => {
    const classes = styles();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleClick = () => props.logIn(username, password);

    const handleChangeUsername = event => setUsername(event.target.value);

    const handleChangePassword = event => setPassword(event.target.value);

    return (
        <TransitionsModal>
            <Grid container component={Paper} className={classes.form}>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="username">Username (e-mail)</InputLabel>
                        <Input id="username" autoComplete="username" onChange={handleChangeUsername} />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input id="password" type="password" autoComplete="current-password" onChange={handleChangePassword} />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained" color="primary"
                        className={classes.button} onClick={handleClick}>
                        Log in
                    </Button>
                </Grid>
            </Grid>
        </TransitionsModal>
    );
};

const mapStateToProps = state => ({
    hasLoggedIn: state.hasLoggedIn
});

const mapDispatchToProps = dispatch => ({
    logIn: (username, password) => {
        httpclient.fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({username: username, password: password}),
            headers: {'Content-Type': 'application/json'}
        }).then(resp => {
            if (resp.status !== 202) {
                alert('Log in failed');
            }
            else {
                let jwt = resp.headers.get('Authorization');
                localStorage.setItem('JWT', jwt);
                dispatch(logIn());
            }
        });
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

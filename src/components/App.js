import MainLayout from "./Layout";
import Login from "./Login";
import {connect} from "react-redux";
import {useEffect} from "react";
import {logIn} from "../actions/security";

const App = (props) => {
    const { hasLoggedIn } = props;

    useEffect(() => {
        if (localStorage.getItem('JWT')) {
            props.logIn();
        }
    }, [props]);

    return (
        hasLoggedIn ? <MainLayout /> : <Login />
    );
}

const mapStateToProps = state => ({
    hasLoggedIn: state.hasLoggedIn
});

const mapDispatchToProps = dispatch => ({
    logIn: () => dispatch(logIn())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
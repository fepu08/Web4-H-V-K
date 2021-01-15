import axios from 'axios';
import { setAlert } from "./alert";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from "./types";

// Register User
export const register = ({first_name, last_name, email, password}) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({first_name, last_name, email, password});
    try {
        const res = await axios.post('/api/users', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(setAlert("User added successfully", 'success'));
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
            type: REGISTER_FAIL
        })
    }
}
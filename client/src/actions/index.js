import axios from "axios";
import { browserHistory } from "react-router";
import { AUTH_USER, AUTH_ERROR, UNAUTH_USER, FETCH_MESSAGE } from "./types";
import { TOKEN } from "../storage/types";
const ROOT_URL = "http://localhost:3090";

function authUser({ email, password }, action, error) {
    return function (dispatch) {
        axios.post(`${ROOT_URL}/${action}`, { email, password })
            .then(response => {
                dispatch({
                    type: AUTH_USER
                });
                localStorage.setItem(TOKEN, response.data.token);
                browserHistory.push("/feature");
            })
            .catch(({ response }) => {
                dispatch(authError(error ? error : response.data.error));
            });
    }
}

export function signinUser({ email, password }) {
    return authUser({ email, password }, "signin", "Bad Login Info");
}

export function authError(error) {
    return {
        type: AUTH_ERROR,
        payload: error
    }
}

export function signoutUser() {
    localStorage.removeItem(TOKEN);
    return {
        type: UNAUTH_USER
    }
}

export function signupUser({ email, password }) {
    return authUser({ email, password }, "signup");
}

export function fetchMessage() {
    return function (dispatch) {
        axios.get(ROOT_URL, {
            headers: {
                authorization: localStorage.getItem(TOKEN)
            }
        }).then(response => {
            dispatch({
                type: FETCH_MESSAGE,
                payload: response.data.message
            });
        });
    }
}
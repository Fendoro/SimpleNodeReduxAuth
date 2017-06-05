import React, { Component } from "react";
import { reduxForm } from "redux-form";
import _ from "lodash";
import * as actions from "../../actions";

const FIELDS = {
    email: {
        id: 1,
        type: "email",
        label: "Email"
    },
    password: {
        id: 2,
        type: "password",
        label: "Password"
    },
    passwordConfirm: {
        id: 3,
        type: "password",
        label: "Confirm password"
    }
}

class Signup extends Component {
    handleFormSubmit(formProps) {
        this.props.signupUser(formProps);
    }

    renderAlert() {
        const errorMessage = this.props.errorMessage;
        if (errorMessage) {
            return (
                <div className="alert alert-danger">
                    <strong>Ooops!</strong> {errorMessage}
                </div>
            );
        }
    }

    renderField(fieldConfig, field) {
        const fieldHelper = this.props.fields[field];

        return (
            <fieldset key={fieldConfig.id} className="form-group">
                <label>{fieldConfig.label}:</label>
                <input type={fieldConfig.type} {...fieldHelper} className="form-control" />
                {fieldHelper.touched && fieldHelper.error && <div className="error">{fieldHelper.error}</div>}
            </fieldset>
        );
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                {_.map(FIELDS, this.renderField.bind(this))}
                {this.renderAlert()}
                <button action="submit" className="btn btn-primary">Sign up</button>
            </form>
        );
    }
}

function validate(formProps) {
    const errors = {};
    if (formProps.password !== formProps.passwordConfirm) {
        errors.password = "Passwords must match";
    }
    _.each(FIELDS, (type, field) => {
        if (!formProps[field]) {
            const label = FIELDS[field].label.toLowerCase();
            errors[field] = `Please enter a ${label}`;
        }
    });
    return errors;
}

function mapStateToProps(state) {
    return { errorMessage: state.auth.error };
}

export default reduxForm({
    form: "signup",
    fields: _.keys(FIELDS),
    validate
}, mapStateToProps, actions)(Signup);
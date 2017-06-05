import React, { Component } from "react";
import { reduxForm } from "redux-form";
import _ from "lodash";
import * as actions from "../../actions";

const FIELDS = {
    email: {
        id: 1,
        label: "Email"
    },
    password: {
        id: 2,
        label: "Password"
    }
};

class Signin extends Component {
    handleFormSubmit({ email, password }) {
        this.props.signinUser({ email, password });
    }

    renderField(fieldConfig, field) {
        const fieldHelper = this.props.fields[field];

        return (
            <fieldset key={fieldConfig.id} className="form-group">
                <label>{fieldConfig.label}:</label>
                <input type={fieldConfig.label.toLowerCase()} {...fieldHelper} className="form-control" />
            </fieldset>
        );
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

    render() {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                {_.map(FIELDS, this.renderField.bind(this))}
                {this.renderAlert()}
                <button action="submit" className="btn btn-primary">Sign in</button>
            </form>
        );
    }
}

function mapStateToProps(state) {
    return { errorMessage: state.auth.error };
}

export default reduxForm({
    form: "signin",
    fields: _.keys(FIELDS)
}, mapStateToProps, actions)(Signin);
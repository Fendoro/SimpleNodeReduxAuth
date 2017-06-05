import React, { Component } from "react";
import { connect } from "react-redux";

export default function (ComposedComponent) {
    class Authentication extends Component {
        static contextTypes = {
            router: React.PropTypes.object
        }

        checkAuth(isAuth) {
            if (!isAuth) {
                this.context.router.push("/");
            }
        }

        componentWillMount() {
            this.checkAuth(this.props.authenticated);
        }

        componentWillUpdate(nextProps) {
             this.checkAuth(nextProps.authenticated);
        }

        render() {
            return <ComposedComponent {...this.props} />
        }
    }

    function mapStateToProps(state) {
        return { authenticated: state.auth.authenticated };
    }

    return connect(mapStateToProps)(Authentication);
}
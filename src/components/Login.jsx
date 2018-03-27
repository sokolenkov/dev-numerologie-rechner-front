import React, { Component } from 'react';

import { graphql } from 'react-apollo';
import { Link, withRouter } from 'react-router-dom';

import Panel from './Panel';
import InputField from './InputField';

import logo from '../logo.png';

import { AUTH_TOKEN } from '../utils/AuthUtils';
import { loginMutation } from '../graphql/Mutations';
import '../styles/InputForm.css';

/**
 * Login Form component
 */
class Login extends Component {
  /**
   * default constructor
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
    };

    // members for authentication
    this.email = null;
    this.password = null;
  }

  /**
   * attempts to login user
   */
  loginUser = async () => {
    console.log(`Login ${this.email} with ${this.password}`);
    const result = await this.props.loginMutation({
      variables: {
        email: this.email,
        password: this.password,
      },
    });

    this.saveUserToken(result.data.login);

    // redirecting to user home
    this.props.history.push('/userHome');
  };

  saveUserToken = (token) => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  /**
   * default render method
   */
  render() {
    return (
      <div className="page-register-v3 layout-full">
        <div className="page vertical-align">
          <div className="page-content">
            <div className="text-center">
              <img
                className="brand-img logo"
                height="150"
                src={logo}
                alt="logo"
              />
            </div>
            <div className="row justify-content-md-center">
              <div className="col-lg-4">
                <Panel title="Login">
                  <InputField
                    icon="wb-user"
                    fieldName="Email-Adresse"
                    onChange={(event) => {
                      this.email = event.target.value;
                    }}
                  />
                  <InputField
                    icon="wb-lock"
                    fieldName="Passwort"
                    onChange={(event) => {
                      this.password = event.target.value;
                    }}
                  />
                  <button
                    className="btn btn-primary btn-block"
                    onClick={this.loginUser}
                  >
                    Login
                  </button>
                  <div className="InputForm__options">
                    <Link to="/reset">
                      <h6>Passwort zurücksetzen</h6>
                    </Link>
                    <Link to="/register">
                      <h6>Registrieren</h6>
                    </Link>
                  </div>
                </Panel>
                <div>
                  <h5>{this.state.errorMessage}</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default graphql(loginMutation, { name: 'loginMutation' })(withRouter(Login));

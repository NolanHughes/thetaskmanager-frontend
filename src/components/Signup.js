import React from 'react';
import $ from 'jquery';

import AppHeader from './AppHeader'

export default class Signup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: []
    }
  }

  handleSignup = (e) => {
    e.preventDefault();
    debugger
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3001/auth',
      data: {
        email: this.email.value,
        password: this.password.value,
        name: e.target.name.value
      }
    })
    .done((response, status, jqXHR) => {
      debugger
      sessionStorage.setItem("user",
        JSON.stringify({
          'access-token': jqXHR.getResponseHeader('access-token'),
          client: jqXHR.getResponseHeader('client'),
          uid: response.data.uid,
          name: response.data.name
        })
      );
      this.props.history.push('/')
    })
    .fail((response) => {
      let errors = response.responseJSON.errors.full_messages

      this.setState({
        errors: errors
      })
    });

  }

  render () {
    let counter = 0

    let errors = this.state.errors.map( error => {
      ++counter
      return(<p key={counter}>{error}</p>)
    })

    return (
      <div>
        <AppHeader />
        <div className="login-errors">
          {errors}
        </div>
        <h2>Sign up</h2>
        <form onSubmit={this.handleSignup} >
          <input 
            name="email" 
            placeholder="Email" 
            autoComplete="username" 
            ref={(input) => this.email = input} />
          <input 
            name="password" 
            placeholder="Password" 
            type="password" 
            autoComplete="current-password" 
            ref = {(input) => this.password = input} />
          <input 
            name="name" 
            placeholder="Name" 
            type="text" 
            autoComplete="username" 
            ref = {(input) => this.name = input} />
          <input type="submit"/>
        </form>
      </div>
    )
  }
}
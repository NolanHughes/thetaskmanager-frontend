import React from 'react';
import $ from 'jquery';

export default class Signup extends React.Component {
  handleSignup = (e) => {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3001/auth',
      data: {
        email: this.email.value,
        password: this.password.value
      }
    })
    .done((response, status, jqXHR) => {
      sessionStorage.setItem("user",
        JSON.stringify({
          'access-token': jqXHR.getResponseHeader('access-token'),
          client: jqXHR.getResponseHeader('client'),
          uid: response.data.uid
        })
      );
      this.props.history.push('/')
    })

  }

  render () {
    return (
      <div>
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
          <input type="submit"/>
        </form>
      </div>
    )
  }
}
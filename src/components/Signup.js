import React from 'react';
import $ from 'jquery';

export default class Signup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: []
    }
  }

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
          <input type="submit"/>
        </form>
      </div>
    )
  }
}
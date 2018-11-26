import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import $ from 'jquery';

import '../css/Navbar.css'

export default class AppHeader extends React.Component { 
	componentDidMount () {
		$.ajax({
			type: 'GET',
			url: 'http://localhost:3001/auth/validate_token',
      dataType: "JSON",
      headers: JSON.parse(sessionStorage.getItem('user'))
		})
		.fail((data) => {
			debugger
			this.props.history.push('/login');
		})
	}

	handleSignOut = (e) => {
		e.preventDefault();
		$.ajax({
			type: 'DELETE',
			url: 'http://localhost:3001/auth/sign_out',
			data: JSON.parse(sessionStorage.user)
		})
		.done(() => {
			sessionStorage.removeItem('user');
			this.props.history.push('/login');			
		})
	}

	render () {
		if(sessionStorage.getItem('user')) {
			let userEmail = JSON.parse(sessionStorage.getItem('user')).uid
			let userId = userEmail.substring(0, userEmail.indexOf("@"))
			
			return (
				<div className="Navbar">       
			    <nav className="Navbar__Items Navbar__Items--left">
				    <Link to='/'>
				      <h2 className="Navbar__Link">
				        Meyer & O'Connor
				      </h2>
			      </Link>
			      <div className="Navbar__Link Navbar__Items--selected">
			        Tasks
			      </div>
			    </nav>

			    <nav className="Navbar__Items Navbar__Items--right">
			      <div className="Navbar__Link">
			        <p>
								<span className="userId-navbar">Welcome {userId}</span>
								<button onClick={this.handleSignOut} >Sign out</button>
							</p>
			      </div>
			    </nav>
			  </div>
			)
		} else {
			return (
				<Redirect to='/login' />
			)
		}
	}
}
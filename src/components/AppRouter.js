import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Tasks from './Tasks';
import Login from './Login'
import Signup from './Signup'
import '../css/App.css'

export default (props) => {
	return(
		<Router>			
			<div className="app">
				<Route exact path="/" component={Tasks} />
				<Route path="/login" component={Login} />
				<Route path="/signup" component={Signup} />
			</div>
		</Router>
	)
}
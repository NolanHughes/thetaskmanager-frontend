import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Appointments from './Appointments';
import AppHeader from './AppHeader';
import TaskForm from './TaskForm';
import Login from './Login'
import '../css/App.css'

export default (props) => {
	return(
		<Router> 
			<div className="app">
				<Route path="/" component={AppHeader}/>
				<Route exact path="/" component={Appointments} />
				<Route path="/login" component={Login} />
				<Route path="/appointments/:id/edit" component={TaskForm} />
			</div>
		</Router>
	)
}
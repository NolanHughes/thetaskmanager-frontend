import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

import {formatDate} from '../utils/format';

export default class Appointment extends React.Component {
  constructor(props) {
  	super(props)

  	this.state = {
  		appointment: props.appointment
  	}
  }

  componentDidMount() {
  	if(this.props.match) {
  		fetch(`http://localhost:3001/api/v1/appointments/${this.props.match.params.id}`)
  		.then(res => res.json())
  		.then(json => {
	  		this.setState({
	  			appointment: json
	  		})  			
  		})
	  }
  }

  static propTypes = {
		appointment: PropTypes.object.isRequired
	}

	static defaultProps = { 
		appointment: {}
	}

	render() {
		return(
		  <div className='appointment'>
		  	<Link to={`/appointments/${this.state.appointment.id}`}>
		    	<h3>{this.state.appointment.title}</h3>
		    </Link>
		   	<p>{formatDate(this.state.appointment.appt_time)}</p>
		   	<Link to={`/appointments/${this.state.appointment.id}/edit`} >
		   		Edit
		   	</Link>
		  </div>
	  )
	}
}
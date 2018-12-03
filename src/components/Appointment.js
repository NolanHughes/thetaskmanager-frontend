import React from 'react';
import PropTypes from 'prop-types';

import {formatDate} from '../utils/format';

export default class Appointment extends React.Component {
  constructor(props) {
  	super(props)

  	this.state = {
  		appointment: props.appointment
  	}
  }

  static propTypes = {
		appointment: PropTypes.object.isRequired
	}

	static defaultProps = { 
		appointment: {}
	}

	handleEditClick = (id) => {
		this.props.openTaskForm(id)
	}

	render() {

		return(
		  <div className='appointment'>
		    <span>{this.state.appointment.title}</span>
		   	<p>{formatDate(this.state.appointment.appt_time)}</p>
		   	<button onClick={() => this.handleEditClick(this.state.appointment.id)}>
		   		Edit inline
		   	</button>
		  </div>
	  )
	}
}
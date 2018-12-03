import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery'

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

	deleteAppointment = () => {
    const id = this.state.appointment.id

    if(window.confirm("Are you sure you want to delete this appointment?")) {
      $.ajax({
        type: "DELETE",
        url: `http://localhost:3001/api/v1/appointments/${id}`,
        headers: JSON.parse(sessionStorage.getItem('user'))
      })
      .done(() => {
        console.log('deleted')
        this.props.handleAppointment(id);
      })
      .fail((response) => {
        console.log('appointment deleting failed!');
      });
    }
  }

	render() {

		return(
		  <div className='appointment'>
		    <span>{this.state.appointment.title}</span>
		   	<p>{formatDate(this.state.appointment.appt_time)}</p>
		   	<button onClick={() => this.handleEditClick(this.state.appointment.id)}>
		   		Edit inline
		   	</button>
        <button onClick={this.deleteAppointment}>
          Delete task
        </button>
		  </div>
	  )
	}
}
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import $ from 'jquery'

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
      $.ajax({
        type: "GET",
        url: `http://localhost:3001/api/v1/appointments/${this.props.match.params.id}`,
        dataType: "JSON",
        headers: JSON.parse(sessionStorage.getItem('user'))
      }).done((data) => {
        this.setState({appointment: data});
      });
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
import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import AppointmentForm from './AppointmentForm';
import { AppointmentsList } from './AppointmentsList';
import { TaskHeader } from './TaskHeader';

import '../css/Tasks.css'

export default class Appointments extends React.Component {
  constructor (props, railsContext) {
    super(props)
    this.state = {
      appointments: this.props.appointments
    }
  }

  static propTypes = {
    appointments: PropTypes.array.isRequired
  }

  static defaultProps = {
    appointments: []
  }

  componentDidMount() {
    if(this.props.match && sessionStorage.user) {
      $.ajax({
        type: "GET",
        url: 'http://localhost:3001/api/v1/appointments',
        dataType: "JSON",
        headers: JSON.parse(sessionStorage.getItem('user'))
      }).done((data) => {
        this.setState({appointments: data});
      });
    }
  }

  addNewAppointment = (appointment) => {
    const sortedAppointments = [...this.state.appointments, appointment].sort(function(a,b){
        return new Date(a.appt_time) - new Date(b.appt_time);
      })

    this.setState({
      appointments: sortedAppointments
    });
  }

  handleHeaderClick = () => {
    const taskList = document.getElementById("task-list")
    const downArrow = document.getElementById("downArrow")
    const rightArrow = document.getElementById("rightArrow") 

    if(taskList.style.display !== "none") {
      taskList.style.display = "none"
      downArrow.style.display = "none"
      rightArrow.style.display = "inline-flex"
    } else {
      taskList.style.display = "block"
      downArrow.style.display = "inline-flex"
      rightArrow.style.display = "none"
    }
  }

  render () {
    return (
      <div className="container">
        <div className="tasks">
          <AppointmentForm handleNewAppointment={this.addNewAppointment} />

          <TaskHeader handleHeaderClick={this.handleHeaderClick}/>

          <AppointmentsList appointments={this.state.appointments} />
        </div>
      </div>
    )
  }
}
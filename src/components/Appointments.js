import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { AppointmentsList } from './AppointmentsList';
import { TasksHeader } from './TasksHeader';
import TaskForm from './TaskForm'

import '../css/Tasks.css'

export default class Appointments extends React.Component {
  constructor (props, railsContext) {
    super(props)
    this.state = {
      appointments: this.props.appointments,
      editing: false,
      appointmentId: null,
      renderForm: false
    }
    
    this.handleFormUnmount = this.handleFormUnmount.bind(this);
    this.handleFormMount = this.handleFormMount.bind(this);
  }

  static propTypes = {
    appointments: PropTypes.array.isRequired
  }

  static defaultProps = {
    appointments: []
  }



  handleAppointment = (appointment) => {
    let appointments = this.state.appointments
    let appt = appointments.find(a => a.id === appointment.id);

    if (appt) {
      appt.appt_time = appointment.appt_time
      appt.title = appointment.title
    } else {
      appointments = [...this.state.appointments, appointment]
    }

    const sortedAppointments = appointments.sort(function(a,b){
      return new Date(a.appt_time) - new Date(b.appt_time);
    })
      
    this.setState({
      appointments: sortedAppointments,
      appointmentId: null,
      editing: false
    });

    this.handleFormUnmount()
  }

  handleFormUnmount(){      
    this.setState({
      renderForm: false
    });
  }


  handleFormMount = (id) => {
    if(id) {
      this.setState({
        renderForm: true,
        editing: true,
        appointmentId: id
      })
    } else {
      this.setState({
        renderForm: true
      })
    }
  }

  componentDidMount() {
    if(sessionStorage.user) {
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
      <React.Fragment>
        <div className="container">
          <div className="tasks">
            <div id="add-task">
              <button onClick={() => this.handleFormMount()}>Add task</button>
            </div>

            <TasksHeader handleHeaderClick={this.handleHeaderClick} />

            <AppointmentsList appointments={this.state.appointments} openTaskForm={this.handleFormMount}/>
          </div>
          {this.state.renderForm ? <TaskForm handleAppointment={this.handleAppointment} updateAppointment={this.handleAppointment} editing={this.state.editing} id={this.state.appointmentId}/> : null}
        </div>
      </React.Fragment>
    )
  }
}
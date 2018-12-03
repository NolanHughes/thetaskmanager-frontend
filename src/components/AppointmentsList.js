import React from 'react';
import PropTypes from 'prop-types';

import Appointment from './Appointment'

export const AppointmentsList = ({appointments, openTaskForm}) => 
  <div id="task-list">
    {appointments.map(appointment => (
      <Appointment appointment={appointment} key={appointment.id} openTaskForm={openTaskForm}/>
    ))}
  </div>

AppointmentsList.propTypes = {
	appointments: PropTypes.array.isRequired
}

AppointmentsList.defaultProps = {
  appointments: []
}

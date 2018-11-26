import React from 'react';
import PropTypes from 'prop-types';

import Appointment from './Appointment'

export const AppointmentsList = ({appointments}) => 
  <div id="task-list">
    {appointments.map(function(appointment) {
      return (
        <Appointment appointment={appointment} key={appointment.id} />
      )
    })}
  </div>

AppointmentsList.propTypes = {
	appointments: PropTypes.array.isRequired
}

AppointmentsList.defaultProps = {
  appointments: []
}
import React from 'react';
import PropTypes from 'prop-types'
import Datetime from 'react-datetime';
import moment from 'moment';
import update from 'immutability-helper';
import './react-datetime.css';
import $ from 'jquery'

import { validations } from '../utils/validations';
import { FormErrors } from './FormErrors';


export default class AppointmentForm extends React.Component {
  constructor (props, railsContext) {
    super(props)
    this.state = {
      title: {value: '', valid: false},
      appt_time: {value: new Date(), valid: false},
      formErrors: {},
      formValid: false,
      editing: false
    }
  }

  static propTypes = {
    handleNewAppointment: PropTypes.func
  }

  static formValidations = {
    title: [
      (string) => { return(validations.checkMinLength(string, 1)) }
    ],
    appt_time: [
      (time) => { return(validations.timeShouldBeFuture(time)) }
    ]
  }

  componentDidMount() {
    if(this.props.match) {
      $.ajax({
        type: "GET",
        url: `http://localhost:3001/api/v1/appointments/${this.props.match.params.id}`,
        dataType: "JSON",
        headers: JSON.parse(sessionStorage.getItem('user'))
      }).done((data) => {
        this.setState({
                        title: {value: data.title, valid: true},
                        appt_time: {value: data.appt_time, valid: true},
                        editing: this.props.match.path === '/appointments/:id/edit'
        });
      });
    }
  }

  handleUserInput = (fieldName, fieldValue, validations) => {
    const newFieldState = {value: fieldValue, valid: this.state[fieldName].valid}

    this.setState({[fieldName]: newFieldState},
                  () => { this.validateField(fieldName, fieldValue, validations) });
  }

  validateField (fieldName, fieldValue, validations) {
    let fieldValid;

    let fieldErrors = validations.reduce((errors, v) => {
      let e = v(fieldValue);
      if (e !== '') {
        errors.push(e);
      }
      return(errors);
    }, []);
    
    fieldValid = fieldErrors.length === 0;

    const newFieldState = {value: this.state[fieldName].value, valid: fieldValid}
    const newFormErrors = update(this.state.formErrors, {$merge: {[fieldName]: fieldErrors}});

    this.setState({
      [fieldName]: newFieldState,
      formErrors: newFormErrors
    }, this.validateForm);
  }

  validateForm () {
    this.setState({
      formValid: this.state.title.valid && this.state.appt_time.valid
    });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    this.state.editing ? this.updateAppointment() : this.addAppointment()
  }

  addAppointment() {
    const appointment = {
      title: this.state.title.value, 
      appt_time: this.state.appt_time.value
    };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3001/api/v1/appointments',
      data: {appointment: appointment},
      headers: JSON.parse(sessionStorage.getItem('user'))
    })
    .done((data) => {
      this.props.handleNewAppointment(data);
      this.resetFormErrors();
    })
    .fail((response) => {
      this.setState({
        formErrors: response.responseJSON,
        formValid: false
      });
    });
  }

  updateAppointment() {
    const appointment = {
      title: this.state.title.value,
      appt_time: this.state.appt_time.value
    };
    
    $.ajax({
      type: "PATCH",
      url: `http://localhost:3001/api/v1/appointments/${this.props.match.params.id}`,
      data: {appointment: appointment},
      headers: JSON.parse(sessionStorage.getItem('user'))
    })
    .done((data) => {
      alert('appointment updated!');
      this.props.history.push('/');
    })
    .fail((response) => {
      this.setState({
        formErrors: response.responseJSON,
        formValid: false
      });
    });  
  }

  deleteAppointment = () => {
    if(window.confirm("Are you sure you want to delete this appointment?")) {
      $.ajax({
        type: "DELETE",
        url: `http://localhost:3001/api/v1/appointments/${this.props.match.params.id}`,
        headers: JSON.parse(sessionStorage.getItem('user'))
      })
      .done((data) => {
        this.props.history.push('/');
      })
      .fail((response) => {
        console.log('appointment deleting failed!');
      });
    }
  }

  resetFormErrors () {
    this.setState({formErrors: {}})
  }

  handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    this.handleUserInput(
      fieldName, 
      fieldValue,
      AppointmentForm.formValidations[fieldName]
    );
  }

  setApptTime = (e) => {
    const fieldName = 'appt_time';
    const fieldValue = e.toDate();
    this.handleUserInput(
      fieldName, 
      fieldValue,
      AppointmentForm.formValidations[fieldName]
    );
  }

  render () {
    const inputProps = {
      name: 'appt_time'
    };

    return (
      <div id="add-task">
        <h2>
          {this.state.editing ?
            'Update task' :
            'Make a new task' }
         </h2>
        <FormErrors formErrors = {this.state.formErrors} />
        <form onSubmit={this.handleFormSubmit}>
          <input name='title' placeholder='Task Title'
            value={this.state.title.value}
            onChange={this.handleChange} />

          <Datetime input={false} open={true} inputProps={inputProps}
            value={moment(this.state.appt_time.value)}
            onChange={this.setApptTime} />

          <input type='submit'
            value={this.state.editing ?
                    'Update Task' :
                    'Make Task'}
            className='submit-button'
            disabled={!this.state.formValid} />
        </form>
        {this.state.editing && (
          <p>
            <button onClick={this.deleteAppointment}>
              Delete task
            </button>
          </p>
        )}
      </div>
    )
  }
}
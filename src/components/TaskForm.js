import React from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import update from 'immutability-helper';
import '../css/react-datetime.css';
import $ from 'jquery'

import { validations } from '../utils/validations';
import { FormErrors } from './FormErrors';

import '../css/Tasks.css'

export default class TaskForm extends React.Component {
  constructor (props, railsContext) {
    super(props)
    this.state = {
      title: {value: '', valid: false},
      due_by: {value: new Date(), valid: false},
      formErrors: {},
      formValid: false,
      editing: props.editing
    }
  }

  static formValidations = {
    title: [
      (string) => { return(validations.checkMinLength(string, 1)) }
    ],
    due_by: [
      (time) => { return(validations.timeShouldBeFuture(time)) }
    ]
  }

  componentDidMount() {  
    if(this.props.editing) {
      $.ajax({
        type: "GET",
        url: `http://localhost:3001/api/v1/tasks/${this.props.id}`,
        dataType: "JSON",
        headers: JSON.parse(sessionStorage.getItem('user'))
      }).done((data) => {
        this.setState({
          title: {value: data.title, valid: true},
          due_by: {value: data.due_by, valid: true}
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
      formValid: this.state.title.valid && this.state.due_by.valid
    });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();

    this.state.editing ? this.updateTask() : this.addTask()
  }

  addTask() {
    const task = {
      title: this.state.title.value, 
      due_by: this.state.due_by.value
    };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3001/api/v1/tasks',
      data: {task: task},
      headers: JSON.parse(sessionStorage.getItem('user'))
    })
    .done((data) => {
      this.resetFormErrors();
      this.props.handleTask(data);      
    })
    .fail((response) => {
      this.setState({
        formErrors: response.responseJSON,
        formValid: false
      });
    });
  }

  updateTask() {
    const task = {
      title: this.state.title.value,
      due_by: this.state.due_by.value
    };
    
    $.ajax({
      type: "PATCH",
      url: `http://localhost:3001/api/v1/tasks/${this.props.id}`,
      data: {task: task},
      headers: JSON.parse(sessionStorage.getItem('user'))
    })
    .done((data) => {
      this.setState({
        editing: false
      })
      this.props.handleTask(data);
    })
    .fail((response) => {
      this.setState({
        formErrors: response.responseJSON,
        formValid: false
      });
    });  
  }

  deleteTask = () => {
    const id  = this.props.id
    if(window.confirm("Are you sure you want to delete this task?")) {
      $.ajax({
        type: "DELETE",
        url: `http://localhost:3001/api/v1/tasks/${id}`,
        headers: JSON.parse(sessionStorage.getItem('user'))
      })
      .done(() => {
        console.log('deleted')
        this.props.handleTask(id);
      })
      .fail((response) => {
        console.log('task deleting failed!');
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
      TaskForm.formValidations[fieldName]
    );
  }

  setDueBy = (e) => {
    const fieldName = 'due_by';
    const fieldValue = e.toDate();
    this.handleUserInput(
      fieldName, 
      fieldValue,
      TaskForm.formValidations[fieldName]
    );
  }

	render() {
		const inputProps = {
      name: 'due_by'
    };

		return(
			<div className="task-form-container">
				<FormErrors formErrors = {this.state.formErrors} />

	      <form onSubmit={this.handleFormSubmit} id="task-form">
	        <input name='title' id="task-title" placeholder='Task Title'
	          value={this.state.title.value}
	          onChange={this.handleChange} />

	         <Datetime 
	         	input={false} 
	         	open={true} 
	         	inputProps={inputProps}
            value={moment(this.state.due_by.value)}
            onChange={this.setDueBy} 
            className="datetime" />

	        <input type='submit'
	          value={this.state.editing ? 'Update Task' : 'Make Task'}
	          className='submit-button'
	          disabled={!this.state.formValid} />
	      </form>

	      {this.state.editing && (
	        <p>
	          <button onClick={this.deleteTask}>
	            Delete task
	          </button>
	        </p>
	      )}
      </div>
		)    
	}
}

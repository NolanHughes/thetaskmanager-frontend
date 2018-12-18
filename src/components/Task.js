import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery'

import {formatDate} from '../utils/format';

export default class Task extends React.Component {
  static propTypes = {
		task: PropTypes.object.isRequired
	}

	static defaultProps = { 
		task: {}
	}

	handleEditClick = (id) => {
		this.props.openTaskForm(id)
	}

  addRecurringTask(task) {
    var date = new Date()
    date.setDate(date.getDate() + 1);
    
    let newTask = {
      title: task.title, 
      due_by: date,
      assigned_to_id: task.assigned_to_id,
      category_id: task.category_id,
      recurring: task.recurring,
      notes: task.notes
    };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3001/api/v1/tasks',
      data: {task: newTask},
      headers: JSON.parse(sessionStorage.getItem('user'))
    })
    .done((data) => {
      this.props.handleAddingTask(data);      
    })
    .fail((response) => {
      this.setState({
        formErrors: response.responseJSON,
        formValid: false
      });
    });
  }

	deleteTask = () => {
    const task = this.props.task

    if(window.confirm("Are you sure you want to complete this task?")) {
      if (task.recurring) {
        this.addRecurringTask(task)
      }

      $.ajax({
        type: "DELETE",
        url: `http://localhost:3001/api/v1/tasks/${task.id}`,
        headers: JSON.parse(sessionStorage.getItem('user'))
      })
      .done(() => {
        console.log('deleted')
        this.props.handleDeletingTask(task.id);
      })
      .fail((response) => {
        console.log('task deleting failed!');
      });
    }
  }

	render() {
    let createdBy = this.props.users.find( user => user.id === this.props.task.user_id).name

		return(
		  <div className='task'>
        <button onClick={this.deleteTask}>
          Delete
        </button>
        <div className="clickable-task-portion" onClick={() => this.handleEditClick(this.props.task.id)}>
  		    <span className="title">{this.props.task.title}</span>
  		   	<p>{formatDate(this.props.task.due_by)} | </p>
          {this.props.assigned_user ? 
            <p>Assigned To: {this.props.assigned_user.name}</p> :
            <p>Created By: {createdBy}</p>
          }
        </div>
		  </div>
	  )
	}
}
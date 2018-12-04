import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery'

import {formatDate} from '../utils/format';

export default class Task extends React.Component {
  constructor(props) {
  	super(props)

  	this.state = {
  		task: props.task
  	}
  }

  static propTypes = {
		task: PropTypes.object.isRequired
	}

	static defaultProps = { 
		task: {}
	}

	handleEditClick = (id) => {
		this.props.openTaskForm(id)
	}

	deleteTask = () => {
    const id = this.state.task.id

    if(window.confirm("Are you sure you want to delete this task?")) {
      $.ajax({
        type: "DELETE",
        url: `http://localhost:3001/api/v1/appointments/${id}`,
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

	render() {

		return(
		  <div className='task'>
		    <span>{this.state.task.title}</span>
		   	<p>{formatDate(this.state.task.appt_time)}</p>
		   	<button onClick={() => this.handleEditClick(this.state.task.id)}>
		   		Edit inline
		   	</button>
        <button onClick={this.deleteTask}>
          Delete task
        </button>
		  </div>
	  )
	}
}
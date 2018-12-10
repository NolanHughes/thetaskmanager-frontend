import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task'

export class TasksList extends React.Component {
  render() {
    let tasks = this.props.tasks.map(task => {
      let assigned_user = this.props.users.find(user => {
        return user.id === task.assigned_to_id;
      });

      return(
        <Task 
        task={task} 
        key={task.id}
        assigned_user={assigned_user}
        openTaskForm={this.props.openTaskForm} 
        handleTask={this.props.handleTask} />
      )
    })

    return(
      <div id="task-list">
        {tasks}
      </div>
    )
  }
}

TasksList.propTypes = {
	tasks: PropTypes.array.isRequired
}

TasksList.defaultProps = {
  tasks: []
}

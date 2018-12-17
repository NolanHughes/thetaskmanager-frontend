import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task'
import { TasksHeader } from './TasksHeader'

export class TasksList extends React.Component {
  render() {
    let yourTasks = this.props.yourTasks.map(task => {
      let assigned_user = this.props.users.find(user => {
        return user.id === task.assigned_to_id;
      });

      return(
        <Task 
        task={task} 
        key={task.id}
        assigned_user={assigned_user}
        openTaskForm={this.props.openTaskForm} 
        handleDeletingTask={this.props.handleDeletingTask} />
      )
    })

    let assignedTasks = this.props.assignedTasks.map(task => {
      let assigned_user = this.props.users.find(user => {
        return user.id === task.assigned_to_id;
      });

      return(
        <Task 
        task={task} 
        key={task.id}
        assigned_user={assigned_user}
        openTaskForm={this.props.openTaskForm} 
        handleDeletingTask={this.props.handleDeletingTask} />
      )
    })  

    // If you add more headers/lists follow naming conventions set below. 
    // For task list div id: id="[insert list name here]-task-list"
    // For name prop of TasksHeader: Capital letter of what will preface " Task" of display.
    // Make sure these are the same thing or it will break.
    // debugger
    return(
      <div>
      <div>
        <TasksHeader name={'Your'} />
        <div id="Your-task-list">       
          {yourTasks.length !== 0 ? yourTasks : <div className="empty-task-list">You have no tasks that need to be completed.</div>}
        </div>
      </div>
      <div>
        <TasksHeader name={'Assigned'} />
        <div id="Assigned-task-list">       
          {(assignedTasks.length !== 0 ? assignedTasks : <div className="empty-task-list">You have no tasks assigned to other people.</div> )}
        </div>
      </div>
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

import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task'

export const TasksList = ({tasks, openTaskForm, handleTask}) => 
  <div id="task-list">
    {tasks.map(task => (
      <Task 
      	task={task} 
      	key={task.id} 
      	openTaskForm={openTaskForm} 
      	handleTask={handleTask} />
    ))}
  </div>

TasksList.propTypes = {
	tasks: PropTypes.array.isRequired
}

TasksList.defaultProps = {
  tasks: []
}

import React from 'react';

import '../css/Tasks.css'

export const TasksHeader = ({name}) => (
  <div>
    <span id="tasks-header" onClick={handleHeaderClick.bind(null, name)}>
      <div className="TaskGroupHeader-arrow">
        <svg viewBox="0 0 32 32" >
          <path id={name + "DownArrow"} className="arrow" display="inline-flex" fill="black" d="M7.207,13.707L16.5,23l9.293-9.293c0.63-0.63,0.184-1.707-0.707-1.707H7.914C7.023,12,6.577,13.077,7.207,13.707z"/>
          <path id={name + "RightArrow"} className="arrow" display="none" fill="black" d="M13.707,6.707L23,16l-9.293,9.293C13.077,25.923,12,25.477,12,24.586V7.414C12,6.523,13.077,6.077,13.707,6.707z"></path>
        </svg>  
      </div>
      {name + " Tasks"}
    </span>
  </div>
)

const handleHeaderClick = (name) => {
  const taskList = document.getElementById(`${name}-task-list`)
  const downArrow = document.getElementById(`${name}DownArrow`)
  const rightArrow = document.getElementById(`${name}RightArrow`) 

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
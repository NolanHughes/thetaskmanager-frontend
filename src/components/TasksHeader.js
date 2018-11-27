import React from 'react';

import '../css/Tasks.css'

export const TasksHeader = ({handleHeaderClick}) =>
	<div>
    <span id="tasks-header" onClick={() => handleHeaderClick()}>
      <div className="TaskGroupHeader-arrow">
        <svg viewBox="0 0 32 32" >
          <path id="downArrow" className="arrow" display="inline-flex" fill="black" d="M7.207,13.707L16.5,23l9.293-9.293c0.63-0.63,0.184-1.707-0.707-1.707H7.914C7.023,12,6.577,13.077,7.207,13.707z"/>
          <path id="rightArrow" className="arrow" display="none" fill="black" d="M13.707,6.707L23,16l-9.293,9.293C13.077,25.923,12,25.477,12,24.586V7.414C12,6.523,13.077,6.077,13.707,6.707z"></path>
        </svg>  
      </div>
      All of Your Tasks
    </span>
  </div>
import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { TasksList } from './TasksList';
import { TasksHeader } from './TasksHeader';
import TaskForm from './TaskForm'

import '../css/Tasks.css'

export default class Tasks extends React.Component {
  constructor (props, railsContext) {
    super(props)
    this.state = {
      tasks: this.props.tasks,
      editing: false,
      taskId: null,
      renderForm: false
    }
    
    this.handleFormUnmount = this.handleFormUnmount.bind(this);
    this.handleFormMount = this.handleFormMount.bind(this);
  }

  static propTypes = {
    tasks: PropTypes.array.isRequired
  }

  static defaultProps = {
    tasks: []
  }

  handleTask = (task) => {
    let tasks = this.state.tasks

    if (typeof task === 'object' && task !== null) {      
      let t = tasks.find(a => a.id === task.id);
  
      if (t) {
        t.appt_time = task.appt_time
        t.title = task.title
      } else {
        tasks = [...this.state.tasks, task]
      }

      const sortedTasks = tasks.sort(function(a,b){
        return new Date(a.appt_time) - new Date(b.appt_time);
      })
        
      this.setState({
        tasks: sortedTasks
      });
    } else {
      let id = task

      let index = tasks.map(x => {
        return x.id;
      }).indexOf(id);

      tasks.splice(index, 1);
  
      this.setState({
        tasks: tasks
      })  
    }

    this.handleFormUnmount()
  }

  handleFormUnmount(){      
    this.setState({
      renderForm: false,
      taskId: null,
      editing: false
    });
  }


  handleFormMount = (id) => {
    if (this.state.renderForm === false) {
      if (id) {
        this.setState({
          renderForm: true,
          editing: true,
          taskId: id
        })
      } else {
        this.setState({
          renderForm: true
        })
      }
    } else {
      if(id === this.state.taskId) {
        alert("You're already editing that task")
      } else if (id === undefined) {
        if (window.confirm("Are you sure you want to add a new task before saving this task?")) {
          this.setState({
            editing: false,
            taskId: null
          })
        }
      } else {
        if (window.confirm("Are you sure you want to edit this task before saving your task?")) {
          this.setState({
            taskId: id,
            editing: true
          })
        }
      }
    }
  }

  componentDidMount() {
    if(sessionStorage.user) {
      $.ajax({
        type: "GET",
        url: 'http://localhost:3001/api/v1/appointments',
        dataType: "JSON",
        headers: JSON.parse(sessionStorage.getItem('user'))
      }).done((data) => {
        this.setState({tasks: data});
      });
    }
  }


  handleHeaderClick = () => {
    const taskList = document.getElementById("task-list")
    const downArrow = document.getElementById("downArrow")
    const rightArrow = document.getElementById("rightArrow") 

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

  render () {
    if(sessionStorage.getItem('user')) {
      return (
        <React.Fragment>
          <div className="container">
            <div className="tasks">
              <div id="add-task">
                <button onClick={() => this.handleFormMount()}>Add task</button>
              </div>

              <TasksHeader handleHeaderClick={this.handleHeaderClick} />

              <TasksList tasks={this.state.tasks} openTaskForm={this.handleFormMount} handleTask={this.handleTask}/>
            </div>
            {this.state.renderForm ? <TaskForm key={this.state.taskId} handleTask={this.handleTask} updateTask={this.handleTask} editing={this.state.editing} id={this.state.taskId}/> : null}
          </div>
        </React.Fragment>
      )
    } else {
      return(null)
    }
  }
}
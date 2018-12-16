import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { TasksList } from './TasksList';
import TaskForm from './TaskForm'

import '../css/Tasks.css'

export default class Tasks extends React.Component {
  constructor (props, railsContext) {
    super(props)
    this.state = {
      yourTasks: [],
      assignedTasks: [],
      users: [],
      editing: false,
      taskId: null,
      renderForm: false
    }
    
    this.handleFormUnmount = this.handleFormUnmount.bind(this);
    this.handleFormMount = this.handleFormMount.bind(this);
    this.handleAddingTask = this.handleAddingTask.bind(this)
    this.handleUpdatingTask = this.handleUpdatingTask.bind(this)
    this.handleDeletingTask = this.handleDeletingTask.bind(this)
  }

  static propTypes = {
    yourTasks: PropTypes.array.isRequired,
    assignedTasks: PropTypes.array.isRequired
  }

  static defaultProps = {
    yourTasks: [],
    assignedTasks: []
  }

  handleAddingTask(task) {
    let yourTasks = this.state.yourTasks
    let assignedTasks = this.state.assignedTasks

    let currentUserEmail = JSON.parse(sessionStorage.getItem('user')).uid
    let assignedUserEmail = this.state.users.find(user => user.id === task.assigned_to_id).email

    if (currentUserEmail === assignedUserEmail){
      yourTasks = [...this.state.yourTasks, task]

      const sortedTasks = yourTasks.sort(function(a,b){
        return new Date(a.due_by) - new Date(b.due_by);
      })
        
      this.setState({
        yourTasks: sortedTasks
      });
    } else {
      assignedTasks = [...this.state.assignedTasks, task]

      const sortedTasks = assignedTasks.sort(function(a,b){
        return new Date(a.due_by) - new Date(b.due_by);
      })
        
      this.setState({
        assignedTasks: sortedTasks
      });
    }

    this.handleFormUnmount()
  }

  handleUpdatingTask(task) {
    let yourTasks = this.state.yourTasks
    let assignedTasks = this.state.assignedTasks
    let currentUserEmail = JSON.parse(sessionStorage.getItem('user')).uid
    let assignedUserEmail = this.state.users.find(user => user.id === task.assigned_to_id).email

    if (currentUserEmail === assignedUserEmail){
      let t = yourTasks.find(a => a.id === task.id)

      if (t) {
        t.due_by = task.due_by
        t.title = task.title
        t.assigned_to_id = task.assigned_to_id
        t.category_id = task.category_id      

        const sortedTasks = yourTasks.sort(function(a,b){
          return new Date(a.due_by) - new Date(b.due_by);
        })
        
        this.setState({
          yourTasks: sortedTasks
        });        
      } else {   
        yourTasks = [...this.state.yourTasks, task]

        const sortedTasks = yourTasks.sort(function(a,b){
          return new Date(a.due_by) - new Date(b.due_by);
        })
        this.handleDeletingTask(task.id)

        this.setState({
          yourTasks: sortedTasks
        });        
      }
    } else {  
      let t = assignedTasks.find(a => a.id === task.id)

      if (t) {
        t.due_by = task.due_by
        t.title = task.title
        t.assigned_to_id = task.assigned_to_id
        t.category_id = task.category_id

        const sortedTasks = assignedTasks.sort(function(a,b){
          return new Date(a.due_by) - new Date(b.due_by);
        })
        
        this.setState({
          assignedTasks: sortedTasks
        });
        
      } else {
        assignedTasks = [...this.state.assignedTasks, task]

        const sortedTasks = assignedTasks.sort(function(a,b){
          return new Date(a.due_by) - new Date(b.due_by);
        })
        
        this.handleDeletingTask(task.id)
        
        this.setState({
          assignedTasks: sortedTasks
        });        
      }
    }

    this.handleFormUnmount()
  }

  handleDeletingTask = (id) => {    
    let yourTasks = this.state.yourTasks
    let assignedTasks = this.state.assignedTasks
    
    if (yourTasks.find(task => task.id === id)){
      let index = yourTasks.map(x => {
        return x.id;
      }).indexOf(id);

      yourTasks.splice(index, 1);
  
      this.setState({
        yourTasks: yourTasks
      })          
    } else {
      let index = assignedTasks.map(x => {
        return x.id;
      }).indexOf(id);

      assignedTasks.splice(index, 1);
  
      this.setState({
        assignedTasks: assignedTasks
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
        url: 'http://localhost:3001/api/v1/tasks',
        dataType: "JSON",
        headers: JSON.parse(sessionStorage.getItem('user'))
      }).done((data) => {
        this.setState({
          yourTasks: data.your_tasks,
          assignedTasks: data.assigned_tasks,
          users: data.users
        });
      });
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

              <TasksList 
                yourTasks={this.state.yourTasks} 
                assignedTasks={this.state.assignedTasks} 
                openTaskForm={this.handleFormMount} 
                handleDeletingTask={this.handleDeletingTask} 
                users={this.state.users}
              />
            </div>
            {this.state.renderForm ? <TaskForm 
              key={this.state.taskId} 
              handleUpdatingTask={this.handleUpdatingTask} 
              handleAddingTask={this.handleAddingTask}
              handleDeletingTask={this.handleDeletingTask}
              editing={this.state.editing} 
              id={this.state.taskId} 
              users={this.state.users}/>: null
            }
          </div>
        </React.Fragment>
      )
    } else {
      return(null)
    }
  }
}
import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import { TasksList } from './TasksList';
import TaskForm from './TaskForm'
import AppHeader from './AppHeader'

import '../css/Tasks.css'

export default class Tasks extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      yourTasks: [],
      assignedTasks: [],
      users: [],
      category: 1,
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

  // Category is hard coded right now
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

  handleCategoryChange = (e) => {

    let id = parseInt(e.target.value)

    if (id !== this.state.category) {
      e.target.classList.add('Navbar__Items--selected');
      e.target.classList.remove('Navbar__Items--not-selected');

      document.getElementById(`category${this.state.category}`).classList.add('Navbar__Items--not-selected');
      document.getElementById(`category${this.state.category}`).classList.remove('Navbar__Items--selected');

      this.setState({
        category: id
      })
    } 
  }

  render () {
    if(sessionStorage.getItem('user')) {
      return (
        <React.Fragment>
          <AppHeader handleCategoryChange={this.handleCategoryChange} history={this.props.history}/>
          <div className="container">
            <div className="tasks">
              <div id="add-task">
                <button onClick={() => this.handleFormMount()}>Add task</button>
              </div>

              <TasksList 
                yourTasks={this.state.yourTasks.filter(task => task.category_id === this.state.category)} 
                assignedTasks={this.state.assignedTasks.filter(task => task.category_id === this.state.category)} 
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
              handleFormUnmount={this.handleFormUnmount}
              editing={this.state.editing} 
              id={this.state.taskId} 
              users={this.state.users}/>: null
            }
          </div>
        </React.Fragment>
      )
    } else {
      return(
        <div>
          <AppHeader handleCategoryChange={this.handleCategoryChange} history={this.props.history}/>
          Welcome to The Task Manager. Click the log in or sign up button to get started.
        </div>
      )
    }
  }
}
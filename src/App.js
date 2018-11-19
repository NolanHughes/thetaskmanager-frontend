import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      appointments: []
    }
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/v1/appointments')
    .then(res => res.json())
    .then(json => {
      this.setState({appointments: json });
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <div>
          {this.state.appointments.map(appointment => {
            return(<p key={appointment.id}>{appointment.title}</p>)
          })}
        </div>
      </div>
    );
  }
}

export default App;

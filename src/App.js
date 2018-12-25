import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import Register from "./Register";
import Session from "./Session";

class App extends Component {
  state = {
    fields: {}
  };

  onChange = updatedValue => {
    this.setState({
      fields: {
        ...this.state.fields,
        ...updatedValue
      }
    });
  };

  render() {
    return (
      <div className="App">
        <br />
        <div class="row">
          <div class="column">
            <Register onChange={fields => this.onChange(fields)} />
            <p>{JSON.stringify(this.state.fields, null, 2)}</p>
          </div>
          <div class="column">
            <Session onChange={fields => this.onChange(fields)} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;

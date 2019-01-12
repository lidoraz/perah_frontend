import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import Register from "./Register";
import Session from "./Session";
import Login from "./Login";

class App extends Component {
  state = {
    fields: {},
    isLoggedIn: false,
    userId: null,
    hello: true
  };

  onChange = updatedValue => {
    this.setState({
      fields: {
        ...this.state.fields,
        ...updatedValue
      }
    });
  };
  loggedIn = inputUserId => {
    this.setState({
      isLoggedIn: true,
      userId: inputUserId
    });
    // this.state.isLoggedIn = true;
    console.log("CLICKED ON SUBMIT from login!" + inputUserId);
    console.log("CLICKED ON SUBMIT from login!" + this.state.userId);
    setTimeout(() => {
      // show hello, then start session
      this.setState({
        hello: false
      });
    }, 2000);
  };
  render() {
    return (
      <div className="App">
        <br />
        <div class="centered">
          <div>
            {!this.state.isLoggedIn ? (
              <div>
                <Login
                  setLoggedIn={inputUserId => this.loggedIn(inputUserId)}
                />
                <Register onChange={fields => this.onChange(fields)} />
                <p>{JSON.stringify(this.state.fields, null, 2)}</p>
              </div>
            ) : (
              <div>
                {this.state.hello ? (
                  <h1>Hello {this.state.userId}!</h1>
                ) : (
                  <Session loggedUserId={this.state.userId} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

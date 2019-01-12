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
  loggedIn = inputUserId => {
    this.setState({
      isLoggedIn: true,
      userId: inputUserId
    });
    // this.state.isLoggedIn = true;
    console.log("CLICKED ON SUBMIT from login!" + inputUserId);
    console.log("CLICKED ON SUBMIT from login!" + this.state.userId);
  };
  // registered = inputUserId => {
  //   loggedIn(inputUserId);
  //   this.setState({
  //     isLoggedIn: true,
  //     userId: inputUserId
  //   });
  // };
  render() {
    return (
      <div className="App">
        <br />
        <div class="centered">
          <div>
            {!this.state.isLoggedIn ? (
              <div>
                <h1>Welcome to Perah App!</h1>
                <h2>login or register to start</h2>
                <Login
                  setLoggedIn={inputUserId => this.loggedIn(inputUserId)}
                />
                <Register
                  onregistered={inputUserId => this.registered(inputUserId)}
                />
              </div>
            ) : (
              <div>
                <Session loggedUserId={this.state.userId} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

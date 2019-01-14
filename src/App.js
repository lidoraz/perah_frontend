import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
import Register from "./Register";
import Session from "./Session";
import Login from "./Login";

class App extends Component {
  componentDidMount() {
    document.title = "Perah";
  }
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
    console.log("CLICKED ON SUBMIT from login!" + inputUserId);
  };

  render() {
    return (
      <div className="App">
        <div className="noselect">
          <div className="app-container">
            {!this.state.isLoggedIn ? (
              <div>
                <h1>Welcome to Perah App!</h1>
                <h2>Login or register to start</h2>
                <div className="loginRegisterContainer">
                  <Login
                    setLoggedIn={inputUserId => this.loggedIn(inputUserId)}
                  />
                  <br />
                  <Register
                    onregistered={inputUserId => this.registered(inputUserId)}
                  />
                </div>
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

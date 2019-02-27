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
        <script type="text/javascript">
          {(document.oncontextmenu = new Function("return false;"))}
          {(document.onselectstart = new Function("return false;"))}
        </script>
        <div className="noselect">
          <div className="disabledrag">
            <div className="app-container">
              {!this.state.isLoggedIn ? (
                <div className="TOP_login">
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
      </div>
    );
  }
}

export default App;

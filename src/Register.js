import React from "react";
import axios from "axios";
import GLOBAL_VARS from "./Consts";
export default class Register extends React.Component {
  state = {
    user_id: "",
    fname: "",
    lname: "",
    gender: "",
    sexual_oreintation: "",
    race: "",
    profession: "",

    status: null,
    registerStatus: 0
  };

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  sumbitForm = params => {
    console.log("sumbitForm");
    console.log(params);
    let url = GLOBAL_VARS.backendIP + "reg";
    axios
      .get(url, {
        params
      })
      .then(response => {
        // console.log(response);
        // var res = JSON.parse(response);
        let result = response.data;
        console.log("response.data:" + response.data);
        switch (result) {
          case 0:
            this.setState({
              status:
                "Welcome " +
                this.state.fname +
                "! \nYou now can login with your ID: " +
                this.state.user_id,
              registerStatus: 2
            });
            break;
          case -1:
            this.setState({
              status: "User named " + this.fname + " is already registerd"
            });
            break;
          case -2:
            this.setState({
              status: "One or more of the parameters are missing"
            });
            break;
          default:
            this.setState({
              status: "Unkown error occured"
            });
        }
      })
      .catch(error => {
        console.log("Failed :()");
        console.log(error.data);
        this.setState({
          status:
            "Error occured, Are one of the parameters are missing or incorrect?"
        });
      });
  };

  onSubmit = e => {
    e.preventDefault();
    let params = this.state;
    this.sumbitForm(params);
  };
  showRegister = e => {
    this.setState({ registerStatus: 1 });
    console.log("register clicked!");
  };

  render() {
    return (
      <div>
        {this.state.registerStatus == 0 && (
          <button onClick={e => this.showRegister(e)}>Register</button>
        )}
        <div className="registerForm">
          {this.state.registerStatus == 1 && (
            <div className="regContainer">
              <h2>Perah register file</h2>
              <h4>Please make sure to fill up all your details correctly</h4>
              <form>
                <input
                  name="user_id"
                  placeholder="ID"
                  value={this.state.user_id}
                  onChange={e => this.change(e)}
                />
                <br />
                <input
                  name="fname"
                  placeholder="First Name"
                  value={this.state.fname}
                  onChange={e => this.change(e)}
                />
                <br />
                <input
                  name="lname"
                  placeholder="Last Name"
                  value={this.state.lname}
                  onChange={e => this.change(e)}
                />
                <br />
                <input
                  name="dob"
                  placeholder="Date of Birth?"
                  value={this.state.dob}
                  onChange={e => this.change(e)}
                />
                <br />
                <br />
                Gender?
                <input
                  type="radio"
                  value="Male"
                  name="gender"
                  onChange={e => this.change(e)}
                />
                Man
                <input
                  type="radio"
                  value="Female"
                  name="gender"
                  onChange={e => this.change(e)}
                />
                Woman
                <br />
                <br />
                <input
                  name="sexual_oreintation"
                  placeholder="Like Woman / Men?"
                  value={this.state.sexual_oreintation}
                  onChange={e => this.change(e)}
                />
                <br />
                <input
                  name="race"
                  type="race"
                  placeholder="Race"
                  value={this.state.race}
                  onChange={e => this.change(e)}
                />
                <br />
                <input
                  name="profession"
                  type="profession"
                  placeholder="What do you do? student etc.."
                  value={this.state.profession}
                  onChange={e => this.change(e)}
                />
                <br />
                <br />
                <button onClick={e => this.onSubmit(e)}>
                  Click to Register
                </button>
                <br />
              </form>
            </div>
          )}
        </div>
        <h2>{this.state.status}</h2>
      </div>
    );
  }
}

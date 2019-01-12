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
    isLoggedIn: false,
    showRegister: false
  };
  fname = null;

  change = e => {
    this.props.onChange({ [e.target.name]: e.target.value });
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  sumbitForm = params => {
    console.log("handleClick Success!");
    // console.log(params);
    let url = GLOBAL_VARS.backendIP + "reg";
    axios
      .get(url, {
        params
      })
      .then(response => {
        // console.log(response);
        // var res = JSON.parse(response);
        console.log(response.data);
        this.setState({
          status:
            "Welcome " + this.fname + "! \nYou now can login with your ID!"
        });
      })
      .catch(error => {
        console.log("Failed :()");
        console.log(error.data);
        this.setState({
          status: "Error occured!"
        });
      });
  };

  onSubmit = e => {
    e.preventDefault();
    let params = this.state;

    this.sumbitForm(params);
    // this.props.onSubmit(this.state);
    this.fname = this.state.fname;
    this.setState(
      {
        user_id: "",
        fname: "",
        lname: "",
        dob: "",
        gender: "",
        sexual_oreintation: "",
        race: "",
        profession: ""
      }
      // this.props.setLoggedIn()
    );
    this.props.onChange({
      user_id: "",
      fname: "",
      lname: "",
      dob: "",
      gender: "",
      sexual_oreintation: "",
      race: "",
      profession: ""
    });
  };
  showRegister = e => {
    this.setState({ showRegister: true });
    console.log("register clicked!");
  };

  render() {
    return (
      <div>
        {/* <button onClick={e => this.showRegister(e)}>Register</button> */}
        <div className="registerForm">
          {this.state.showRegister ? (
            <div className="regContainer">
              <h2>Register!</h2>
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
                {/* <input
          name="gender"
          placeholder="Gender? Male/Female"
          value={this.state.gender}
          onChange={e => this.change(e)}
        /> */}
                <br />
                <br />
                <input
                  name="sexual_oreintation"
                  placeholder="Like Men / Woman?"
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
                <button onClick={e => this.onSubmit(e)}>
                  Click to Register
                </button>
                <br />
                <h2>{this.state.status}</h2>
              </form>
            </div>
          ) : (
            <button onClick={e => this.showRegister(e)}>Register</button>
          )}
          <h1>this is a title</h1>
        </div>
      </div>
    );
  }
}

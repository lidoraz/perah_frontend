import React from "react";
import axios from "axios";

export default class Register extends React.Component {
  state = {
    user_id: "",
    fname: "",
    lname: "",
    gender: "",
    sexual_oreintation: "",
    race: "",
    profession: ""
  };

  change = e => {
    this.props.onChange({ [e.target.name]: e.target.value });
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  sumbitForm = params => {
    console.log("handleClick Success!");
    // console.log(params);
    let url = "http://35.176.94.224:8080/reg";
    axios
      .get(url, {
        params
      })
      .then(response => {
        // console.log(response);
        // var res = JSON.parse(response);
        console.log(response.data);
      })
      .catch(error => {
        console.log("Failed :()");
        console.log(error.data);
      });
  };

  onSubmit = e => {
    e.preventDefault();
    let params = this.state;

    this.sumbitForm(params);
    // this.props.onSubmit(this.state);
    this.setState({
      user_id: "",
      fname: "",
      lname: "",
      dob: "",
      gender: "",
      sexual_oreintation: "",
      race: "",
      profession: ""
    });
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

  render() {
    return (
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
        {/* <label>
          Pick your favorite flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label> */}
        <input
          name="gender"
          placeholder="Gender? Male/Female"
          value={this.state.gender}
          onChange={e => this.change(e)}
        />
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
        <button onClick={e => this.onSubmit(e)}>Register</button>
      </form>
    );
  }
}

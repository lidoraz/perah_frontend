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
    //sembiraben@gmail.com+
    dob: "1998",
    //sembiraben@gmail.com-
    status: null,
    registerStatus: 0
  };

  //sembiraben@gmail.com+
  checkIfCharsAreValid = (e, validChars) => {
    for (var i = 0; i < e.target.value.length; i++) {
      if (!validChars.includes(e.target.value[i])) {
        return false;
      }
    }
    return true;
  };
  //sembiraben@gmail.com-

  //sembiraben@gmail.com+
  changeInput = (e, length, validChars) => {
    validChars = String(validChars);
    if (
      !this.checkIfCharsAreValid(e, validChars) &&
      e.target.value.length != 0
    ) {
      var msgStart = "Put only ";
      var msgMiddle;
      var msgEnd = " in this field.";
      switch (validChars) {
        case GLOBAL_VARS.numbers:
          msgMiddle = "numbers";
          break;
        case GLOBAL_VARS.letters:
          msgMiddle = "letters, spaces or { ` , ' , - }";
          break;
        case GLOBAL_VARS.lettersWithComma:
          msgMiddle = "letters, spaces, commas or { ` , ' , - }";
          break;
      }
      var msg = msgStart + msgMiddle + msgEnd;
      alert(msg);
    } else if (e.target.value.length <= length) {
      this.setState({
        [e.target.name]: e.target.value
      });
    } else {
      alert("Length should be " + length + ".");
    }
  };
  //sembiraben@gmail.com-

  change = e => {
    //sembiraben@gmail.com+
    if (e.target.name === "user_id") {
      this.changeInput(e, 9, GLOBAL_VARS.numbers);
    } else if (e.target.name === "dob") {
      this.changeInput(e, 4, GLOBAL_VARS.numbers);
    } else if (e.target.name === "fname" || e.target.name === "lname") {
      this.changeInput(e, 30, GLOBAL_VARS.letters);
    } else if (e.target.name === "race" || e.target.name === "profession") {
      this.changeInput(e, 30, GLOBAL_VARS.lettersWithComma);
    } else {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
    //sembiraben@gmail.com-
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
                "! \nNow you can login with your ID: " +
                this.state.user_id,
              registerStatus: 2
            });
            break;
          case -1:
            this.setState({
              status: "User named " + this.state.fname + " is already registerd"
            });
            alert(
              this.state.status +
                ", choose one from the header and this popup.."
            );
            break;
          case -2:
            this.setState({
              status: "One or more of the parameters are missing"
            });
            alert(
              this.state.status +
                ", choose one from the header and this popup.."
            );
            break;
          default:
            this.setState({
              status: "Unkown error occured"
            });
            alert(
              this.state.status +
                ", choose one from the header and this popup.."
            );
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
        {this.state.registerStatus === 0 && (
          <button className="button" onClick={e => this.showRegister(e)}>
            Register
          </button>
        )}
        <div className="registerForm">
          <h2 class="ERROR">{this.state.status}</h2>
          {this.state.registerStatus === 1 && (
            <div className="regContainer">
              <h4>Please make sure to fill up all your details correctly</h4>
              <form>
                <div class="divTable">
                  <div class="divTableBody">
                    <div class="divTableRow">
                      <div className="divTableCell">Your ID</div>
                      <div class="divTableCell">
                        <input
                          type="number"
                          name="user_id"
                          min="010000000"
                          max="999999999"
                          placeholder="ID"
                          value={this.state.user_id}
                          onChange={e => this.change(e)}
                        />
                      </div>
                    </div>
                    <div class="divTableRow">
                      <div class="divTableCell">First Name</div>
                      <div class="divTableCell">
                        <input
                          name="fname"
                          type="text"
                          placeholder="First Name"
                          value={this.state.fname}
                          onChange={e => this.change(e)}
                        />
                      </div>
                    </div>
                    <div class="divTableRow">
                      <div class="divTableCell">Last Name</div>
                      <div class="divTableCell">
                        <input
                          name="lname"
                          type="text"
                          placeholder="Last Name"
                          value={this.state.lname}
                          onChange={e => this.change(e)}
                        />
                      </div>
                    </div>
                    <div class="divTableRow">
                      <div class="divTableCell">Year of Birth</div>
                      <div class="divTableCell">
                        <input
                          name="dob"
                          type="number"
                          min="1900"
                          max="2010"
                          step="1"
                          value={this.state.dob}
                          onChange={e => this.change(e)}
                        />
                      </div>
                    </div>
                    <div class="divTableRow">
                      <div class="divTableCell">Gender?</div>
                      <div class="divTableCell">
                        <div className="radio-group">
                          <input
                            id="option-one"
                            type="radio"
                            value="Male"
                            name="gender"
                            onChange={e => this.change(e)}
                          />
                          <label for="option-one">Man</label>
                          <input
                            id="option-two"
                            type="radio"
                            value="Female"
                            name="gender"
                            onChange={e => this.change(e)}
                          />
                          <label for="option-two">Woman</label>
                        </div>
                      </div>
                    </div>

                    {/* 
                      <div class="divTableCell">
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
                      </div> */}

                    <div class="divTableRow">
                      <div class="divTableCell">Like Women / Men?</div>
                      <div class="divTableCell">
                        <div className="radio-group">
                          <input
                            id="option-one1"
                            type="radio"
                            value="Women"
                            name="sexual_oreintation"
                            onChange={e => this.change(e)}
                          />
                          <label for="option-one1">Woman</label>
                          <input
                            id="option-two2"
                            type="radio"
                            value="Men"
                            name="sexual_oreintation"
                            onChange={e => this.change(e)}
                          />
                          <label for="option-two2">Man</label>
                          <input
                            id="option-three"
                            type="radio"
                            value="Both"
                            name="sexual_oreintation"
                            onChange={e => this.change(e)}
                          />
                          <label for="option-three">Both!</label>
                        </div>
                      </div>

                      {/* <div class="divTableCell">
                        <input
                          type="radio"
                          value="Women"
                          name="sexual_oreintation"
                          onChange={e => this.change(e)}
                        />
                        Women
                        <input
                          type="radio"
                          value="Men"
                          name="sexual_oreintation"
                          onChange={e => this.change(e)}
                        />
                        Men
                        <input
                          type="radio"
                          value="Both"
                          name="sexual_oreintation"
                          onChange={e => this.change(e)}
                        />
                        Both!
                      </div> */}
                    </div>

                    <div class="divTableRow">
                      <div class="divTableCell">Parents from?</div>
                      <div class="divTableCell">
                        <input
                          name="race"
                          type="text"
                          placeholder="Poland, Iraq, Morroco, etc.."
                          value={this.state.race}
                          onChange={e => this.change(e)}
                        />
                      </div>
                    </div>
                    <div class="divTableRow">
                      <div class="divTableCell">What do you do?</div>
                      <div class="divTableCell">
                        <input
                          name="profession"
                          type="text"
                          placeholder="Student/Lecturer/etc.."
                          value={this.state.profession}
                          onChange={e => this.change(e)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="divTableRowCentered">
                  <button
                    class="registerButton"
                    onClick={e => this.onSubmit(e)}
                  >
                    Click to Register
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }
}

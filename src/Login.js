import React from "react";

export default class Login extends React.Component {
  state = {
    user_id: "",
    isFinished: false,
    isLoggedIn: false,
    sessionType: null,
    showLogin: false
  };
  change = event => {
    this.setState({
      user_id: event.target.value,
      currRating: event.target.value
    });
  };
  onSubmitLogin = e => {
    e.preventDefault();

    let params = {};
    params["user_id"] = this.state.user_id;
    // this.getSessionByType(local);
    this.props.setLoggedIn(this.state.user_id);
  };

  showLogin = e => {
    this.setState({ showLogin: true });
    console.log("Login clicked!");
  };
  render() {
    return (
      <div name="holder">
        {this.state.showLogin ? (
          <div name="login">
            <form>
              <input
                name="user_id"
                placeholder="ID"
                value={this.state.user_id}
                onChange={e => this.change(e)}
              />
              <button className="button" onClick={e => this.onSubmitLogin(e)}>
                Submit
              </button>
            </form>
          </div>
        ) : (
          <button className="button" onClick={e => this.showLogin(e)}>
            Login
          </button>
        )}
      </div>
    );
  }
}

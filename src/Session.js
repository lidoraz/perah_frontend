import React from "react";
import axios from "axios";
import StarRatings from "react-star-ratings";
import StarRatingComponent from "react-star-rating-component";

import GLOBAL_VARS from "./Consts";
//export default
// class Foo extends React.Component {
//   state = {
//     rating: 0
//   };

// }

export default class Session extends React.Component {
  state = {
    user_id: null,
    currImageSrc: "",
    currLocInSession: 0,
    timeBefore: 0,
    rating: -1,
    timesUncertain: -1,
    sessionStatus: "you must be logged in to see this",
    isFinished: false,
    isLoggedIn: false,
    sessionType: null
  };
  tasks = ["ATTRACTIVENESS", "WILLING_FOR_LOAN"];
  sessionNum = 0;

  localSessionData = null;

  changeRating = (newRating, name) => {
    this.setState({
      timesUncertain: this.state.timesUncertain + 1,
      rating: newRating
    });
  };

  change = event => {
    console.log("got input:" + event.target.value);
    // this.setState({
    //   sessionType: event.target.value
    // });
    // console.log("state:" + this.state.sessionType);
    this.setState({
      user_id: event.target.value,
      currRating: event.target.value
    });
    // console.log(event.target);
  };
  getAndStartSessionFromBackend = params => {
    let url = GLOBAL_VARS.backendIP + "sess";
    axios
      .get(url, { params })
      .then(sessionData => {
        console.log("SessionId: " + sessionData.data.sessionId);
        if (!this.state.isLoggedIn) {
          this.setState({ isLoggedIn: true });
        }

        this.localSessionData = sessionData.data; //update local session data
        console.log(
          "SessionType: " +
            this.localSessionData.sessionType +
            " ;#images: " +
            this.localSessionData.imagesPath.length
        );
        this.setState({
          sessionType: this.localSessionData.sessionType,
          sessionStatus: "",
          currImageSrc: this.localSessionData.imagesPath[0],
          currLocInSession: 0,
          timeBefore: Date.now()
        });
      })
      .catch(error => {
        console.log("Failed :()");
        this.setState({
          sessionStatus: "could not reach backend 404",
          responseData: error.toString()
        });
      });
  };
  getSessionByType = type => {
    let params = {};
    params["user_id"] = this.state.user_id;
    params["type"] = type;
    console.log(
      "getSessionByType: user_id=" +
        params["user_id"] +
        " ; type=" +
        params["type"]
    );
    this.getAndStartSessionFromBackend(params);
  };
  // onSubmitLogin = e => {
  //   e.preventDefault();

  //   let params = {};
  //   params["user_id"] = this.state.user_id;
  //   let local = null;
  //   if (Math.random() > 0.5) {
  //     local = this.tasks[0];
  //   } else {
  //     local = this.tasks[1];
  //   }
  //   console.log(local);
  //   this.getSessionByType(local);
  // };

  sendRatingToBackend = params => {
    let url = GLOBAL_VARS.backendIP + "rate";
    axios
      .get(url, {
        params
      })
      .then(rateResponse => {
        console.log(
          "rateResponse: " +
            rateResponse.data +
            " imgNum: " +
            this.state.currLocInSession
        );
        if (
          this.state.currLocInSession ===
          this.localSessionData.imagesPath.length
        ) {
          console.log("FINISHED SESSION");
          let lastSessionType = this.state.sessionType;
          this.setState({
            sessionStatus: "Great! next session is going to start..",
            sessionType: null
          });

          //wait a while...
          this.sessionNum += 1;
          if (this.sessionNum < 2) {
            setTimeout(() => {
              // continue for second round
              let nextSessionType =
                lastSessionType === this.tasks[0]
                  ? this.tasks[1]
                  : this.tasks[0];
              this.getSessionByType(nextSessionType);
              this.setState({
                sessionType: nextSessionType
              });
            }, 2000);
          } else {
            this.localSessionData = null;
            this.setState({
              sessionStatus: "Finished Session, enter ID for more!",
              currLocInSession: 0,
              sessionType: null,
              isLoggedIn: false,
              isFinished: true
            });
          }
        }
      })
      .catch(error => {
        console.log("Failed :()");
        console.log(error);
        this.setState({ responseData: error.toString() });
        // this.onResponse(error.data);
      });
  };
  onSubmitRating = e => {
    e.preventDefault();
    if (this.localSessionData == null || this.state.rating == 0) {
      console.log("this.state.rating == 0");
      return;
    }
    console.log("getRating(): " + this.state.rating);
    // console.log(this.sessionData);
    let ratingParmas = {};
    let timeAfter = Date.now();
    ratingParmas["s"] = this.state.sessionType;

    ratingParmas["photoId"] = this.state.currImageSrc.split("/")[
      this.state.currImageSrc.split("/").length - 1
    ];
    ratingParmas["user_id"] = this.localSessionData.userId;
    ratingParmas["ratingValue"] = this.state.rating;
    ratingParmas["ratingUUID"] = timeAfter;
    ratingParmas["session"] = this.localSessionData.sessionId;
    ratingParmas["iteration"] = this.localSessionData.iterationId;
    ratingParmas["locationInSession"] = this.state.currLocInSession;
    ratingParmas["timeTook"] = timeAfter - this.state.timeBefore;
    ratingParmas["timesUncertain"] = this.state.timesUncertain;
    ratingParmas["phonePosition"] = 0;

    this.sendRatingToBackend(ratingParmas);
    if (this.localSessionData != null) {
      let nextImg = this.state.currLocInSession + 1;
      this.setState({
        currLocInSession: nextImg,
        timeBefore: Date.now(),
        currImageSrc: this.localSessionData.imagesPath[nextImg],
        rating: 0,
        timesUncertain: -1
      });
    }
  };
  onStarHover(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }
  startSession = userId => {
    console.log("startSession" + userId);
    this.setState({ user_id: userId });
    let params = {};
    params["user_id"] = userId;
    let local = null;
    if (Math.random() > 0.5) {
      local = this.tasks[0];
    } else {
      local = this.tasks[1];
    }
    params["type"] = local;
    this.getAndStartSessionFromBackend(params);
  };
  render() {
    return (
      <div name="holder">
        {this.state.user_id == null &&
          this.startSession(this.props.loggedUserId)}
        <div name="imagesHolder" />
        {console.log(
          "Rendered: currentState in page:" + this.state.sessionType
        )}
        <p>{this.state.sessionStatus}</p>
        {!this.state.isFinished && this.state.sessionType && (
          <div>
            <div>
              {/* {console.log("from imageholder:" + this.sessionType)} */}
              {!this.state.isFinished &&
              this.state.sessionType === "ATTRACTIVENESS" ? (
                <h1 style={{ color: "red" }}>How attractive?</h1>
              ) : (
                <h1 style={{ color: "green" }}>Would you give a loan to?</h1>
              )}
            </div>
            {this.state.currImageSrc && (
              <img
                name="currImage"
                src={this.state.currImageSrc}
                class="displayedImage"
              />
            )}

            <br />
            <StarRatings
              rating={this.state.rating}
              starRatedColor="gold"
              starHoverColor="gold"
              changeRating={this.changeRating}
              onStarHover={this.onStarHover.bind(this)}
              numberOfStars={5}
              name="rating"
            />
            <br />
            <form>
              <button
                onClick={e => this.onSubmitRating(e)}
                className={
                  this.state.sessionType === "ATTRACTIVENESS"
                    ? "submitRatingButtonA"
                    : "submitRatingButtonL"
                }
              >
                Rate!
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }
}

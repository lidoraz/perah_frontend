import React from "react";
import axios from "axios";
import StarRatings from "react-star-ratings";
// import { ProgressBar } from "cjs-react-progressbar";
import GLOBAL_VARS from "./Consts";
//export default
// class Foo extends React.Component {
//   state = {
//     rating: 0
//   };

// }
const Filler = props => {
  return (
    <div
      className="filler"
      style={{ width: props.percentage + "%", background: props.color }}
    />
  );
};
const ProgressBar = props => {
  return (
    <div className="progress-bar">
      <Filler percentage={props.percentage} color={props.color} />
    </div>
  );
};

export default class Session extends React.Component {
  state = {
    user_id: null,
    currImageSrc: "",
    currLocInSession: 0,
    timeBefore: 0,
    rating: -1,
    timesUncertain: -1,
    sessionStatus: null,
    isFinished: false,
    isLoggedIn: false,
    sessionType: null,
    hello: false,
    progressBarPercent: 0,
    sessionColor: null
  };
  tasks = ["ATTRACTIVENESS", "WILLING_FOR_LOAN"];
  sessionNum = 0;
  localSessionData = null;
  lastImageIndex = -1;
  preloadImages = imgs => {
    console.log("preloadImages " + imgs.length);
    this.preloadedImages = [imgs.length];
    for (var i = 0; i < imgs.length; i++) {
      this.preloadedImages[i] = new Image();
      this.preloadedImages[i].src = imgs[i];
    }
  };

  changeRating = (newRating, name) => {
    this.setState({
      timesUncertain: this.state.timesUncertain + 1,
      rating: newRating
    });
  };

  setNewImage = imgIdx => {
    console.log("Showing Image " + imgIdx + "/" + this.lastImageIndex);
    this.setState({
      currLocInSession: imgIdx,
      timeBefore: Date.now(),
      currImageSrc: this.localSessionData.imagesPath[imgIdx],
      rating: 0,
      timesUncertain: -1,
      progressBarPercent: 0
    });
  };
  setNewSessionState = () => {
    this.setState({
      sessionType: this.localSessionData.sessionType,
      sessionStatus: ""
    });
  };
  ishandleNextSession = () => {
    if (this.state.currLocInSession === this.lastImageIndex) {
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
            lastSessionType === this.tasks[0] ? this.tasks[1] : this.tasks[0];
          let nextSessionColor =
            this.state.sessionColor === "green" ? "red" : "green";
          this.getSessionByType(nextSessionType);
          this.setState({
            sessionType: nextSessionType,
            sessionColor: nextSessionColor
          });
        }, 3000);
      } else {
        this.localSessionData = null;
        this.lastImageIndex = -1;
        this.setState({
          sessionStatus: "Finished Session. Thank you!",
          currLocInSession: -1,
          sessionType: null,
          isLoggedIn: false,
          isFinished: true,
          progressBarPercent: 0
        });
      }
      // reset interval
      if (GLOBAL_VARS.isTimeLimited) {
        clearInterval(this.progressInterval);
        console.log("clearInterval(this.progressInterval)");
      }
      return true;
    }
    return false;
  };
  startSessionWithSessionData = sessionData => {
    this.localSessionData = sessionData; //update local session data
    this.lastImageIndex = this.localSessionData.imagesPath.length - 1;
    console.log(
      "SessionType: " +
        this.localSessionData.sessionType +
        " ;#images: " +
        this.localSessionData.imagesPath.length
    );
    this.setNewImage(0);
    this.setNewSessionState();
    let percentOF4Seconds = GLOBAL_VARS.timeLimit / 4;
    if (GLOBAL_VARS.isTimeLimited) {
      this.progressInterval = setInterval(() => {
        let percent = this.state.progressBarPercent;
        if (this.state.sessionType != null) {
          if (percent === 100) {
            // change pic
            if (!this.ishandleNextSession()) {
              this.setNewImage(this.state.currLocInSession + 1);
            }
          } else {
            let newPercent = percent + 25;
            // let newPercent = 50;
            console.log("setInterval triggered, val:" + newPercent);
            this.setState({
              progressBarPercent: newPercent
            });
          }
        }
      }, percentOF4Seconds);
    }
  };

  getSessionFromBackend = params => {
    let url = GLOBAL_VARS.backendIP + "sess";
    axios
      .get(url, { params })
      .then(result => {
        let sessionData = result.data;
        if (sessionData.sessionId === -1) {
          this.setState({
            sessionStatus: "User is not registered, refresh page to re-enter id"
          });
        } else {
          console.log("SessionId: " + sessionData.sessionId);
          this.preloadImages(sessionData.imagesPath); // preloading images
          if (!this.state.isLoggedIn) {
            //first time hello
            this.setState({ isLoggedIn: true });
            console.log("then: this.state.user_id:" + this.state.user_id);

            setTimeout(() => {
              this.startSessionWithSessionData(sessionData);
              this.setState({
                hello: false
              });
            }, 2000);
            this.setState({
              hello: true
            });
          } else {
            this.startSessionWithSessionData(sessionData);
          }
        }
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
    this.getSessionFromBackend(params);
  };

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
        if (!this.ishandleNextSession()) {
          this.setNewImage(this.state.currLocInSession + 1);
        }
      })
      .catch(error => {
        console.log("Failed :()");
        console.log(error);
        this.setState({ responseData: error.toString() });
        // this.onResponse(error.data);
      });
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///
  // UPDATE BACKEND AND FRONTEND FOR THIS, CHANGE OR ADD NEW PARAMETER - DID SUBMIT HIS RATING?
  createRating = didSubmit => {
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
    console.log("gotRating: " + this.state.rating);
    return ratingParmas;
  };
  onSubmitRating = e => {
    e.preventDefault();
    if (this.localSessionData === null || this.state.rating === 0) {
      console.log("this.state.rating == 0");
      return;
    }

    if (this.localSessionData != null) {
      this.sendRatingToBackend(this.createRating(true));
    }
  };
  onStarHover(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }
  startSession = userId => {
    console.log("startSession" + userId);
    let local = null,
      sessionColor;
    if (Math.random() > 0.5) {
      local = this.tasks[0];
      sessionColor = "red";
    } else {
      local = this.tasks[1];
      sessionColor = "green";
    }
    let params = {};
    params["user_id"] = userId;
    params["type"] = local;
    this.setState({ user_id: userId, sessionColor: sessionColor });
    this.getSessionFromBackend(params);
  };
  restartSession = e => {
    console.log("restartSession" + this.state.user_id);
    this.setState({
      isFinished: false
    });
    this.startSession(this.state.user_id);
  };
  render() {
    return (
      <div className="sessionHolder">
        {this.state.user_id == null &&
          this.startSession(this.props.loggedUserId)}

        <h3>{this.state.sessionStatus}</h3>
        {this.state.isFinished && <h4>Click on the button below for more!</h4>}

        {this.state.hello ? (
          <h1>Hello {this.state.user_id}!</h1>
        ) : (
          !this.state.isFinished &&
          this.state.sessionType && (
            <div className="innerSessionHolder">
              <div className="progressBar">
                <ProgressBar
                  percentage={this.state.progressBarPercent}
                  color={this.state.sessionColor}
                />
              </div>
              <div className="taskTitle">
                {!this.state.isFinished &&
                this.state.sessionType === "ATTRACTIVENESS" ? (
                  <h2 style={{ color: "red" }}>How Attractive?</h2>
                ) : (
                  <h2 style={{ color: "green" }}>Would you give a loan?</h2>
                )}
              </div>

              <div className="imgContainer">
                {this.state.currImageSrc && (
                  <img
                    name="currImage"
                    src={this.state.currImageSrc}
                    className="displayedImage"
                  />
                )}
              </div>

              <div className="starSubmitContainer">
                <StarRatings
                  rating={this.state.rating}
                  starRatedColor="gold"
                  starHoverColor="gold"
                  changeRating={this.changeRating}
                  onStarHover={this.onStarHover.bind(this)}
                  numberOfStars={5}
                  name="rating"
                />

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
            </div>
          )
        )}
        {this.state.isFinished && (
          <button className="button" onClick={e => this.restartSession(e)}>
            Rate more!
          </button>
        )}
      </div>
    );
  }
}

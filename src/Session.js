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
  //"width 0.02s ease-in";
  let transitionHard = "";
  let transitionSmooth = "width " + GLOBAL_VARS.timeLimit + "ms ease-in";
  let chosenTransition =
    props.transition == "smooth" ? transitionSmooth : transitionHard;
  return (
    <div
      className="filler"
      style={{
        width: props.percentage + "%",
        background: props.color,
        transition: chosenTransition
      }}
    />
  );
};
const ProgressBar = props => {
  return (
    <div className="progress-bar">
      <Filler
        percentage={props.percentage}
        color={props.color}
        transition={props.transition}
      />
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
    showHello: false,
    progressBarPercent: 0,
    sessionColor: null,
    progressBarTransition: "hard"
  };
  tasks = ["ATTRACTIVENESS", "WILLING_FOR_LOAN"];
  localSessionData = null;
  lastImageIndexSession = -1;
  hasUserClicked = false;
  preloadImages = imgs => {
    console.log("preloadImages " + imgs.length);
    this.preloadedImages = [imgs.length];
    for (var i = 0; i < imgs.length; i++) {
      this.preloadedImages[i] = new Image();
      this.preloadedImages[i].src = imgs[i];
    }
    console.log("FINISHED LOADING!!!!!!!!!");
  };
  showWaitingProgressBar = () => {
    let colorBefore = this.state.sessionColor;
    this.setState(
      {
        sessionColor: "Black",
        progressBarPercent: 100,
        progressBarTransition: "smooth"
      },
      () =>
        setTimeout(() => {
          this.setState({
            sessionColor: colorBefore,
            progressBarTransition: "hard",
            progressBarPercent: 0
          });
        }, GLOBAL_VARS.timeLimit - 2)
    );
  };

  changeRating = (newRating, name) => {
    this.setState({
      timesUncertain: this.state.timesUncertain + 1,
      rating: newRating
    });
  };

  setNewImage = imgIdx => {
    console.log("Showing Image " + imgIdx + "/" + this.lastImageIndexSession);
    this.setState(
      {
        currLocInSession: imgIdx,
        timeBefore: Date.now(),
        currImageSrc: this.localSessionData.imagesPath[imgIdx],
        rating: -1,
        timesUncertain: -1,
        progressBarPercent: 0
      },
      () => {
        // after the image has been changed, enable clicking again
        this.hasUserClicked = false;
      }
    );
  };
  setNewSessionState = () => {
    this.setState({
      sessionType: this.localSessionData.sessionType,
      sessionStatus: ""
    });
  };
  resetSessionState = () => {
    this.localSessionData = null;
    this.lastImageIndexSession = -1;
    this.setState({
      currImageSrc: null,
      sessionType: null,
      progressBarPercent: 0,
      currLocInSession: -1
    });
  };
  hasFinishedSession = () => {
    if (this.state.currLocInSession === this.lastImageIndexSession) {
      return true;
    }
    return false;
  };
  handleNextSession = () => {
    // reset interval
    if (GLOBAL_VARS.isTimeLimited) {
      clearInterval(this.progressInterval);
      console.log("clearInterval(this.progressInterval)");
    }
    this.sessionNum += 1;
    if (this.sessionNum < 2) {
      console.log("FINISHED SESSION");
      let nextSessionType =
        this.state.sessionType === this.tasks[0]
          ? this.tasks[1]
          : this.tasks[0];
      let nextSessionColor =
        this.state.sessionColor === "green" ? "red" : "green";
      let spanStyle = { color: nextSessionColor };
      this.resetSessionState();
      this.setState({
        sessionStatus: (
          <div>
            Nice! you have done great!
            <br />
            The Next session is:
            <br />
            <span style={spanStyle}>{nextSessionType}</span>
          </div>
        )
      });
      this.showWaitingProgressBar();
      setTimeout(() => {
        // continue for second round
        this.getSessionByType(nextSessionType);
        this.setState({
          sessionType: nextSessionType,
          sessionColor: nextSessionColor,
          progressBarPercent: 0
        });
      }, GLOBAL_VARS.timeLimit);
    } else {
      this.resetSessionState();
      this.setState({
        sessionStatus: "Finished Session. Thank you!",
        isLoggedIn: false,
        isFinished: true
      });
    }
  };
  setNewImageOrGetNextSession = () => {
    this.hasFinishedSession()
      ? this.handleNextSession()
      : this.setNewImage(this.state.currLocInSession + 1);
  };
  startSessionWithSessionData = sessionData => {
    this.localSessionData = sessionData; //update local session data
    this.lastImageIndexSession = this.localSessionData.imagesPath.length - 1;
    console.log(
      "SessionType:",
      this.localSessionData.sessionType,
      " ;#images:",
      this.localSessionData.imagesPath.length
    );
    this.setNewImage(0);
    this.setNewSessionState();
    let percentOF4Seconds = GLOBAL_VARS.timeLimit / 4;
    if (GLOBAL_VARS.isTimeLimited) {
      this.progressInterval = setInterval(() => {
        let percent = this.state.progressBarPercent;
        // if need to skip interval
        if (this.state.sessionType != null) {
          if (percent === 100) {
            // change pic
            this.setNewImageOrGetNextSession();
          } else {
            let newPercent = percent + 25;
            // let newPercent = 50;
            console.log("setInterval triggered, val:", newPercent);
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
            sessionStatus: "User is not registered, re-enter id",
            user_id: -1
          });
        } else {
          console.log("SessionId: ", sessionData.sessionId);
          this.preloadImages(sessionData.imagesPath); // preloading images
          if (!this.state.isLoggedIn) {
            //first time showHello
            this.setState({ isLoggedIn: true });
            console.log("then: this.state.user_id:", this.state.user_id);
            this.showWaitingProgressBar(GLOBAL_VARS.timeLimit - 3);
            setTimeout(() => {
              this.startSessionWithSessionData(sessionData);
              this.setState({
                showHello: false
              });
            }, GLOBAL_VARS.timeLimit - 2);
            this.setState({
              showHello: true
            });
          } else {
            this.startSessionWithSessionData(sessionData);
          }
        }
      })
      .catch(error => {
        console.log("Failed :()");
        this.setState({
          sessionStatus: "could not reach backend 404"
        });
      });
  };
  getSessionByType = type => {
    let params = {};
    params["user_id"] = this.state.user_id;
    params["type"] = type;
    console.log(
      "getSessionByType: user_id=",
      params["user_id"],
      " ; type=",
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
          "rateResponse: ",
          rateResponse.data,
          " imgNum: ",
          this.state.currLocInSession
        );
        this.setNewImageOrGetNextSession();
      })
      .catch(error => {
        console.log("Error in sendRatingToBackend");
        this.setState({ sessionStatus: error.toString() });
      });
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///
  // UPDATE BACKEND AND FRONTEND FOR THIS, CHANGE OR ADD NEW PARAMETER - DID SUBMIT HIS RATING?
  createRating = didSubmit => {
    let ratingParmas = {};
    let d = new Date();
    let ratingTimeStampWithTimeZoneOffset =
      d.getTime() - d.getTimezoneOffset() * 60 * 1000;
    ratingParmas["s"] = this.state.sessionType;
    ratingParmas["photoId"] = this.state.currImageSrc.split("/")[
      this.state.currImageSrc.split("/").length - 1
    ];
    ratingParmas["user_id"] = this.localSessionData.userId;
    ratingParmas["ratingValue"] = this.state.rating;
    ratingParmas["ratingUUID"] = ratingTimeStampWithTimeZoneOffset;
    ratingParmas["session"] = this.localSessionData.sessionId;
    ratingParmas["iteration"] = this.localSessionData.iterationId;
    ratingParmas["locationInSession"] = this.state.currLocInSession;
    ratingParmas["timeTook"] = Date.now() - this.state.timeBefore;
    ratingParmas["timesUncertain"] = this.state.timesUncertain;
    ratingParmas["phonePosition"] = 0;
    console.log(
      "sentRating- photoID:",
      ratingParmas["photoId"],
      " rating:",
      this.state.rating
    );
    return ratingParmas;
  };
  onSubmitRating = e => {
    e.preventDefault();
    console.log("onSubmitRating: hasUserClicked:", this.hasUserClicked);
    if (
      this.localSessionData === null ||
      this.hasUserClicked ||
      this.state.rating === -1
    ) {
      console.log("this.state.rating === -1");
      return;
    }
    this.hasUserClicked = true;
    this.sendRatingToBackend(this.createRating(true));
  };
  onStarHover(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }
  startSessions = userId => {
    console.log("startSessions" + userId);
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
    this.setState({
      user_id: userId,
      sessionColor: sessionColor,
      isFinished: false
    });
    this.sessionNum = 0;
    this.getSessionFromBackend(params);
  };
  restartSessions = e => {
    console.log("restartSessions" + this.state.user_id);
    this.startSessions(this.state.user_id);
  };
  refreshPage = e => {
    window.location.reload();
  };
  render() {
    return (
      <div className="sessionHolder">
        {this.state.user_id == null &&
          this.startSessions(this.props.loggedUserId)}
        <div className="progressBar">
          <ProgressBar
            percentage={this.state.progressBarPercent}
            color={this.state.sessionColor}
            transition={this.state.progressBarTransition}
          />
        </div>
        <h3>{this.state.sessionStatus}</h3>
        {this.state.user_id === -1 && (
          <button className="button" onClick={e => this.refreshPage(e)}>
            Try again
          </button>
        )}
        {this.state.isFinished && <h4>Click on the button below for more!</h4>}

        {this.state.showHello ? (
          <h1>Hello {this.state.user_id}!</h1>
        ) : (
          !this.state.isFinished &&
          this.state.sessionType && (
            <div className="innerSessionHolder">
              <div className="taskTitle">
                {!this.state.isFinished &&
                this.state.sessionType === "ATTRACTIVENESS" ? (
                  <h2 style={{ color: "red" }}>Attractive?</h2>
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
                  //                   $("<img/>")
                  //     .on('load', function() { console.log("image loaded correctly"); })  RUN A FUNCTION TO START SESSION.
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
          <button className="button" onClick={e => this.restartSessions(e)}>
            Rate more!
          </button>
        )}
      </div>
    );
  }
}

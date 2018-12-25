import React from "react";
import axios from "axios";
import StarRatings from "react-star-ratings";
//export default
// class Foo extends React.Component {
//   state = {
//     rating: 0
//   };

// }

export default class Session extends React.Component {
  state = {
    user_id: "",
    currImageSrc: "",
    currLocInSession: 0,
    timeBefore: 0,
    rating: 0,
    timesUncertain: -1,
    sessionStatus: ""
  };

  localSessionData = null;

  changeRating = (newRating, name) => {
    this.setState({
      timesUncertain: this.state.timesUncertain + 1,
      rating: newRating
    });
  };

  change = event => {
    console.log("in change = e");

    this.setState({
      user_id: event.target.value,
      currRating: event.target.value
    });
    // console.log(event.target);
  };
  getSessionFromBackend = params => {
    let url = "http://localhost:8080/sess";
    axios
      .get(url, { params })
      .then(sessionData => {
        console.log("SessionId: " + sessionData.data.sessionId);
        this.state.timeBefore = Date.now();
        this.localSessionData = sessionData.data;
        this.setState({
          currImageSrc: this.localSessionData.imagesPath[0]
        });
      })
      .catch(error => {
        console.log("Failed :()");
        console.log(error);
        this.setState({ responseData: error.toString() });
      });
  };
  sendRatingToBackend = params => {
    let url = "http://localhost:8080/rate";
    axios
      .get(url, {
        params
      })
      .then(rateResponse => {
        console.log("rateResponse: " + rateResponse.data);
        if (
          this.state.currLocInSession == this.localSessionData.imagesPath.length
        ) {
          console.log("FINISHED SESSION");
          this.localSessionData = null;
          this.state.currLocInSession = 0;
          this.setState({
            sessionStatus: "Finished Session, enter ID for more!"
          });
        }
      })
      .catch(error => {
        console.log("Failed :()");
        console.log(error);
        this.setState({ responseData: error.toString() });
        // this.onResponse(error.data);
      });
  };

  onSubmit = e => {
    e.preventDefault();

    let params = {};
    params["user_id"] = this.state.user_id;
    params["type"] = "ATTRACTIVENESS";

    this.getSessionFromBackend(params);
    this.setState({
      user_id: ""
    });
  };
  onSubmitRating = e => {
    e.preventDefault();
    if (this.localSessionData == null) {
      console.log("onSubmitRating localsession is null");
      return;
    }
    console.log("getRating(): " + this.state.rating);
    // console.log(this.sessionData);
    let ratingParmas = {};
    let timeAfter = Date.now();
    ratingParmas["s"] = "ATTRACTIVENESS";

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

    this.state.currLocInSession += 1;
    this.sendRatingToBackend(ratingParmas);
    if (this.localSessionData != null) {
      this.state.timeBefore = Date.now();
      this.setState({
        currImageSrc: this.localSessionData.imagesPath[
          this.state.currLocInSession
        ],
        rating: 0,
        timesUncertain: -1
      });
    }
  };

  displayImages() {
    return null;
  }

  render() {
    return (
      <div>
        <form>
          <input
            name="user_id"
            placeholder="ID"
            value={this.state.user_id}
            onChange={e => this.change(e)}
          />
          <button onClick={e => this.onSubmit(e)}>Submit</button>
          <br />
          {/* <div>{this.state.responseData.toString()}</div> */}
        </form>
        <div>
          <img
            name="currImage"
            src={this.state.currImageSrc + ".jpg"}
            // style={{ width: 100, height: 100 }}
          />
          <br />
          source:{this.state.currImageSrc}
          <p>{this.state.sessionStatus}</p>
          <br />
          <StarRatings
            rating={this.state.rating}
            starRatedColor="green"
            changeRating={this.changeRating}
            numberOfStars={5}
            name="rating"
          />
          <form>
            {/* <input
              name="rating"
              placeholder="Your rating"
              value={this.state.currRating}
              onChange={e => this.change(e)}
            /> */}
            <button onClick={e => this.onSubmitRating(e)}>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

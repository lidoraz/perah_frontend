import React from "react";
import axios from "axios";
import StarRatings from "react-star-ratings";
//export default
class Foo extends React.Component {
  state = {
    rating: 0
  };
  changeRating = (newRating, name) => {
    this.setState({
      rating: newRating
    });
  };

  render() {
    // rating = 2;
    return (
      <StarRatings
        rating={this.state.rating}
        starRatedColor="green"
        changeRating={this.changeRating}
        numberOfStars={5}
        name="rating"
      />
    );
  }
  getRating() {
    return this.rating;
  }
}

export default class Session extends React.Component {
  state = {
    user_id: "",
    responseData: null,
    currImageSrc: "",
    currRating: "",
    currLocInSession: 0,
    timeBefore: 0
  };

  change = event => {
    console.log("in change = e");
    // this.props.onChange({ [e.target.user_id]: e.target.value });
    this.setState({
      user_id: event.target.value,
      currRating: event.target.value
    });
    // console.log(event.target);
  };
  // viewImages = () => {
  //   console.log("in viewImages...");
  //   console.log(this.imagesPathForSession[0]);
  //   this.setState({ currImageSrc: this.imagesPathForSession[0] });
  // };
  getSessionFromBackend = params => {
    this.state.responseData = "Data Sent!";
    console.log("getSessionFromBackend");
    // console.log(params);
    let url = "http://localhost:8080/sess";
    axios
      .get(url, { params })
      .then(response => {
        console.log("SessionId: " + response.data.sessionId);
        this.setState({
          responseData: "SessionId: " + response.data.sessionId
        });
        this.imagesPathForSession = response.data.imagesPath;
        // console.log("response.data.imagesPath" + response.data.imagesPath);
        console.log(this.imagesPathForSession[0]);
        this.setState({ currImageSrc: this.imagesPathForSession[0] });
        this.state.timeBefore = Date.now();

        // // this.viewImages();
        // console.log(response.data);
        this.state.responseData = response.data;
      })
      .catch(error => {
        console.log("Failed :()");
        console.log(error);
        this.setState({ responseData: error.toString() });
        // this.onResponse(error.data);
      });
  };
  sendRatingToBackend = ratingParmas => {
    // this.responseData = "Data Sent!";
    console.log("sendRatingToBackend");
    // console.log(params);
    let url = "http://localhost:8080/rate";
    axios
      .post(url, { ratingParmas })
      .then(response => {
        console.log("SessionId: " + response.data.sessionId);
        this.setState({
          responseData: "SessionId: " + response.data.sessionId
        });
        this.imagesPathForSession = response.data.imagesPath;
        // this.state.responseData = response.data;
        // this.viewImages();
        console.log(this.state.responseData);
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
    let params = this.state;
    params["type"] = "ATTRACTIVENESS";

    this.getSessionFromBackend(params);
    this.setState({
      user_id: ""
    });
  };
  onSubmitRating = e => {
    e.preventDefault();

    console.log("getRating(): " + oo.getRating());

    let ratingParmas = {};
    let timeAfter = Date.now();
    ratingParmas["ratingType"] = "ATTRACTIVENESS";
    ratingParmas["photoId"] = this.state.currImageSrc.split("/")[-1];
    ratingParmas["user_id"] = this.state.responseData.userId;
    ratingParmas["ratingValue"] = this.state.currRating;
    ratingParmas["ratingUUID"] = timeAfter;
    ratingParmas["session"] = this.state.responseData.sessionId;
    ratingParmas["iteration"] = this.state.responseData.iterationId;
    ratingParmas["locationInSession"] = this.state.currLocInSession;
    ratingParmas["timeTook"] = timeAfter - this.state.timeBefore;
    ratingParmas["timesUncertain"] = 0;
    ratingParmas["phonePosition"] = 0;

    // this.sendRatingToBackend(ratingParmas);
    console.log(ratingParmas);

    this.state.currLocInSession += 1;
    if (this.state.currLocInSession == 3) {
      this.state.currLocInSession = 0;
    }
    this.state.timeBefore = Date.now();
    this.currImageSrc = this.imagesPathForSession[this.state.currLocInSession];
    this.setState({
      currImageSrc: this.imagesPathForSession[this.state.currLocInSession]
    });
  };

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
          <form>
            <input
              name="rating"
              placeholder="Your rating"
              value={this.state.currRating}
              onChange={e => this.change(e)}
            />
            <Foo />
            {/* <StarRatings
              rating={2.403}
              starDimension="40px"
              starSpacing="15px"
            /> */}
            <button onClick={e => this.onSubmitRating(e)}>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

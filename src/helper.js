// export function function1() {
//   //... do stuff
// }
import React from "react";
import GLOBAL_VARS from "./Consts";

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
export const ProgressBar = props => {
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

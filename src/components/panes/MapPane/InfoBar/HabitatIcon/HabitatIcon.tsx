import React from "react";
import clearedForest from "./cleared-forest.svg";
import loggedFragment from "./Logged-Fragment.svg";
import oldGrowth from "./old-growth.svg";
import palmOil from "./palm-oil.svg";
import riparianReserve from "./riparian-reserve.svg";

interface HabitatIconProps {
  habitat?: string | null;
  className?: string;
}

export default function HabitatIcon(props: HabitatIconProps) {
  switch (props.habitat) {
    case "Cleared Forest":
      return (
        <img
          className={props.className}
          src={clearedForest}
          alt="Cleared Forest"
          title="Cleared Forest"
        />
      );
    case "Logged Fragment":
      return (
        <img
          className={props.className}
          src={loggedFragment}
          alt="Logged Fragment"
          title="Logged Fragment"
        />
      );
    case "Old Growth":
      return (
        <img className={props.className} src={oldGrowth} alt="Old Growth" title="Old Growth" />
      );
    case "Oil Palm":
      return <img className={props.className} src={palmOil} alt="Oil Palm" title="Oil Palm" />;
    case "Riparian Reserve":
      return (
        <img
          className={props.className}
          src={riparianReserve}
          alt="Riparian Reserve"
          title="Riparian Reserve"
        />
      );
    default:
      return null;
  }
}

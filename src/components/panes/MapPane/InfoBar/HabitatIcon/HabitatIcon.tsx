import React from "react";
import clearedForest from "./cleared-forest.svg";
import loggedFragment from "./Logged-Fragment.svg";
import oldGrowth from "./old-growth.svg";
import palmOil from "./palm-oil.svg";
import riparianReserve from "./riparian-reserve.svg";

interface HabitatIconProps {
  habitat?: string | null;
}

export default function HabitatIcon(props: HabitatIconProps) {
  switch (props.habitat) {
    case "Cleared Forest":
      return <img src={clearedForest} alt="Cleared Forest" />;
    case "Logged Fragment":
      return <img src={loggedFragment} alt="Logged Fragment" />;
    case "Old Growth":
      return <img src={oldGrowth} alt="Old Growth" />;
    case "Oil Palm":
      return <img src={palmOil} alt="Oil Palm" />;
    case "Riparian Reserve":
      return <img src={riparianReserve} alt="Riparian Reserve" />;
    default:
      return null;
  }
}

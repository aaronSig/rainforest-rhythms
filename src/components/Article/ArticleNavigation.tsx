import { Link } from "@reach/router";
import React from "react";
import { connect } from "react-redux";
import {
  getCurrentSiteAudioId,
  getFocusedSiteId,
  getFocusedTimeSegment
} from "../../state/selectors";
import { State } from "../../state/types";
import logo from "../Navigation/logo.svg";
import styles from "./ArticleNavigation.module.css";

interface ArticleNavigationProps {
  focusedTimeSegment: string | null;
  focusedSiteId: string | null;
  audioId: string | null;
}
function ArticleNavigation(props: ArticleNavigationProps) {
  const time = props.focusedTimeSegment || "06:00";
  const site = props.focusedSiteId || "10";
  const audio = props.audioId ? `/${props.audioId}` : "";
  const backLink = `/${time}/${site}${audio}`;
  return (
    <header role="navigation" className={styles.ArticleNavigation}>
      <Link to={backLink}>
        <img src={logo} alt="SAFE logo" />
      </Link>

      <ul>
        <li>
          <a href="https://www.safeproject.net/" target="_blank" rel="noopener noreferrer">
            The SAFE Project
          </a>
        </li>
      </ul>
    </header>
  );
}

const mapStateToProps = (state: State) => {
  return {
    focusedTimeSegment: getFocusedTimeSegment(state),
    focusedSiteId: getFocusedSiteId(state),
    audioId: getCurrentSiteAudioId(state)
  };
};

const BoundArticleNavigation = connect(mapStateToProps)(ArticleNavigation);

export default BoundArticleNavigation;

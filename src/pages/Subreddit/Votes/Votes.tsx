import styles from "./Votes.module.css";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import React from "react";
import CSSModules from "react-css-modules";

interface Props {
  voteStatus: number;
}

const Votes: React.FC<Props> = ({ voteStatus }) => {
  return (
    <div styleName="votes">
      <BiUpvote styleName="votes__upvote"/>
      <p styleName="votes__likes">{voteStatus}</p>
      <BiDownvote styleName="votes__downvote"/>
    </div>
  );
};

export default CSSModules(Votes, styles, { allowMultiple: true });

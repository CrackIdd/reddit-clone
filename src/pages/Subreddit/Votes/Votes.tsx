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
      <div styleName="votes__vote votes__vote_type_upvote">
        <BiUpvote styleName="votes__icon " />
      </div>
      <p styleName="votes__likes">{voteStatus}</p>
      <div styleName="votes__vote votes__vote_type_downvote">
        <BiDownvote styleName="votes__icon" />
      </div>
    </div>
  );
};

export default CSSModules(Votes, styles, {
  allowMultiple: true,
  handleNotFoundStyleName: "log",
});

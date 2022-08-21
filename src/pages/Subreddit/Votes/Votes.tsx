import styles from "./Votes.module.css";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import React, { useEffect, useReducer, useState } from "react";
import CSSModules from "react-css-modules";
import { selectSignInModalState } from "../../../features/auth/authSlice";
import {
  collection,
  doc,
  increment,
  runTransaction,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db, getUser, getUserId } from "../../../firebase";
import { nanoid } from "nanoid";
import { batch } from "react-redux";
import { useAppSelector } from "../../../hooks/hooks";
import { selectPostId } from "../../../features/post/postSlice";

interface Props {
  voteStatus: number;
  subredditId: string;
}

const Votes: React.FC<Props> = ({ voteStatus, subredditId }) => {
  const [vote, setVote] = useState(0);

  const postId = useAppSelector(selectPostId);

  function handleUpvote() {
    setVote((prevVote) => {
      if (prevVote === 1) {
        return prevVote - 1;
      } else if (prevVote === -1) {
        return prevVote + 2;
      }
      return prevVote + 1;
    });
  }

  function handleDownvote() {
    setVote((prevVote) => {
      if (prevVote === -1) {
        return prevVote + 1;
      } else if (prevVote === 1) {
        return prevVote - 2;
      }
      return prevVote - 1;
    });
  }

  useEffect(() => {
    async function updateData() {
      try {
        const batch = writeBatch(db);

        const postVoteRef = doc(
          db,
          "users",
          `${getUserId()}/postVotes/${postId}`
        );

        const postsVoteRef = doc(db, "posts", postId);

        const newVote = {
          id: postVoteRef.id,
          postId: postId,
          subredditId,
          voteValue: vote,
        };

        batch.set(postVoteRef, newVote);
        batch.update(postsVoteRef, {
          voteStatus: voteStatus + vote,
        });

        await batch.commit();
      } catch (error) {
        console.log(`ERROR: ${error}`);
      }
    }

    updateData();
  }, [vote, postId, subredditId, voteStatus]);

  return (
    <div styleName="votes">
      <div styleName="votes__vote votes__vote_type_upvote">
        <BiUpvote styleName="votes__icon " onClick={handleUpvote} />
      </div>
      <p styleName="votes__likes">{voteStatus + vote}</p>
      <div styleName="votes__vote votes__vote_type_downvote">
        <BiDownvote styleName="votes__icon" onClick={handleDownvote} />
      </div>
    </div>
  );
};

export default CSSModules(Votes, styles, {
  allowMultiple: true,
  handleNotFoundStyleName: "log",
});

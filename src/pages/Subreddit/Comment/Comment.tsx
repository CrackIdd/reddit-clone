import {
  doc,
  DocumentData,
  increment,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import moment from "moment";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import CSSModules from "react-css-modules";
import {
  selectAuthStatus,
  toggleSignInModal,
} from "../../../features/auth/authSlice";
import { db, getUserId, getUserName } from "../../../firebase";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import CommentInteractions from "../CommentInteractions/CommentInteractions";
import styles from "./Comment.module.css";

interface Props {
  comment: DocumentData;
  children: JSX.Element | JSX.Element[];
  postId: string | undefined;
  id: string;
}

const Comment: React.FC<Props> = ({ comment, children, postId, id }) => {
  const isLoggedIn = useAppSelector(selectAuthStatus);
  const dispatch = useAppDispatch();
  const [childCommentText, setChildCommentText] = useState("");
  const onDeleteComment = async () => {
    try {
      if (postId) {
        const batch = writeBatch(db);

        const commentDocRef = doc(db, "comments", id);

        batch.delete(commentDocRef);

        const postDocRef = doc(db, "posts", postId);
        batch.update(postDocRef, {
          numberOfComments: increment(-1),
        });

        await batch.commit();
      }
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }
  };

  const onReply = async () => {
    if (!isLoggedIn) {
      dispatch(toggleSignInModal());
      return;
    }

    if (!postId) return;

    const parentRef = doc(db, "comments", postId);

    const docId = nanoid();
    const newCommentRef = doc(db, "comments", docId);

    await setDoc(newCommentRef, {
      content: childCommentText,
      createdAt: serverTimestamp(),
      id: docId,
      subredditId: id,
      parentId: parentRef.id,
      postId,
      updatedAt: serverTimestamp(),
      userName: getUserName(),
      userId: getUserId(),
      voteStatus: 0,
    });
  };

  return (
    <div styleName="comment">
      <div styleName="comment__user">
        <div styleName="comment__profile">
          <img
            styleName="comment__icon"
            src="https://styles.redditmedia.com/t5_g2km0/styles/profileIcon_snood9e1c00c-b1c6-46a9-a231-a6fcd78cdd16-headshot.png?width=256&height=256&crop=256:256,smart&s=bba24bf813728096bcea480988469df3e9e45c5d"
            alt="default profile icon"
          />
        </div>
        <div styleName="comment__treadline"></div>
      </div>
      <div styleName="comment__content">
        <div styleName="comment__body">
          <div styleName="comment__author">
            <p data-testid="author-description">
              {comment?.userName === getUserName() && `${getUserName()}`}{" "}
              <span styleName="comment__date">
                {moment(new Date(comment?.createdAt?.seconds * 1000)).fromNow()}
              </span>
            </p>
          </div>
          <div styleName="comment__message">{comment?.content}</div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CSSModules(Comment, styles, {
  allowMultiple: true,
  handleNotFoundStyleName: "log",
});

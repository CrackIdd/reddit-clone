import styles from "./Post.module.css";
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { BiMessage } from "react-icons/bi";
import Votes from "../Votes/Votes";
import PostAuthor from "../PostAuthor/PostAuthor";
import PostInteractions from "../PostInteractions/PostInteractions";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import CSSModules from "react-css-modules";
import { render } from "@testing-library/react";
import { db, getUserId } from "../../../firebase";
import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  selectAuthStatus,
  toggleSignInModal,
} from "../../../features/auth/authSlice";
import { nanoid } from "nanoid";
import { useAppSelector } from "../../../hooks/hooks";

interface Props {
  data: DocumentData;
}

const Post: React.FC<Props> = (props) => {
  const { postId } = useParams();

  const [postData, setPostData] = useState<DocumentData | undefined>();

  const isLoggedIn = useAppSelector(selectAuthStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchPost() {
      const postDocRef = collection(db, "posts");

      const q = query(postDocRef, where("id", "==", postId));

      const postDoc = await getDocs(q);

      setPostData(postDoc?.docs[0]?.data());
    }

    props.data ?? fetchPost();
  }, [postId, props.data]);

  async function savePosts() {
    if (isLoggedIn) {
      try {
        await runTransaction(db, async (transaction) => {
          const savedPostsRef = collection(db, "savedPosts");
        });
        const savedPostsRef = collection(db, "savedPosts");

        await addDoc(savedPostsRef, {
          id: nanoid(),
          postId,
          savedAt: serverTimestamp(),
        });
      } catch (error) {
        console.log(`ERROR: ${error}`);
      }
    } else {
      dispatch(toggleSignInModal());
    }
  }
  return (
    <div
      styleName={postId ? "post-excerpt" : "post-excerpt-hover"}
      data-testid="post"
    >
      {postId && (
        <Votes
          voteStatus={props.data?.voteStatus ?? postData?.voteStatus}
          subredditId={props.data?.subredditId ?? postData?.subredditId}
        />
      )}
      <div styleName="post-excerpt__content">
        <PostAuthor
          subredditName={props.data?.subredditName ?? postData?.subredditName}
          userName={props.data?.userName ?? postData?.userName}
          createdAt={props.data?.createdAt ?? postData?.createdAt}
        />
        <div styleName="post-excerpt__container">
          <h3 styleName="post-excerpt__title">
            {props.data?.title ?? postData?.title}
          </h3>
          <p
            styleName={`post-excerpt__description ${
              !postId && "post-excerpt__overflow"
            }`}
          >
            {props.data?.description ?? postData?.description}
          </p>
          <p styleName="post-excerpt__description">
            {props.data?.link ?? postData?.link}
          </p>
          {props.data?.imageURL ||
            (postData?.imageURL && (
              <div styleName="post-excerpt__image-container">
                <img
                  styleName="post-excerpt__image"
                  src={postData?.imageURL ?? props.data?.imageURL}
                  alt="post"
                />
              </div>
            ))}
        </div>
        <div styleName="post__buttons">
          <div styleName="post-excerpt__divider"></div>
          <PostInteractions
            commentsQuantity={
              props.data?.commentsQuantity ?? postData?.commentsQuantity
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CSSModules(Post, styles, {
  allowMultiple: true,
  handleNotFoundStyleName: "log",
});

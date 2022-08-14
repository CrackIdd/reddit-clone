import About from "../About/About";
import Comments from "../Comments/Comments";
import PostAuthor from "../PostAuthor/PostAuthor";
import PostInteractions from "../PostInteractions/PostInteractions";
import Votes from "../Votes/Votes";
import s from "./SinglePost.module.css";
import { useLocation } from "react-router-dom";
import { Location } from "react-router-dom";

type LocationState = {
  title: string;
  description: string;
  created_at: string;
  id: string;
  subreddit_id: string;
  updated_at: string;
  user_id: string;
};

const SinglePostPage = () => {
  const location = useLocation();

  const { title, description } = location.state as LocationState;

  return (
    <section className={s["post-page"]}>
      <Votes />
      <article className={s["post-page__content"]}>
        <PostAuthor />
        <h2 className={s["post-page__title"]}>{title}</h2>
        <p className={s["post-page__description"]}>{description}</p>
        <PostInteractions />
        <textarea placeholder="What are your thoughts"></textarea>
        <Comments />
      </article>
      <aside>
        <About />
      </aside>
    </section>
  );
};

export default SinglePostPage;

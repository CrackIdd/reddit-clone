import CSSModules from "react-css-modules";
import About from "../Subreddit/About/About";
import Posts from "../Subreddit/Posts/Posts";
import styles from "./Home.module.css";
import Card from "../../components/Card/Card";
import { IoIosArrowUp } from "react-icons/io";
import PremiumCard from "./PremiumCard/PremiumCard";
import TopCommunitiesCard from "./TopCommunitiesCard/TopCommunitiesCard";
import PostCreatorCard from "../../components/PostCreatorCard/PostCreatorCard";

const Home: React.FC = () => {
  return (
    <div styleName="home">
      <div styleName="home__content">
        <div className="home__posts">
          <PostCreatorCard />
          <Posts />
        </div>
        <aside styleName="aside">
          <TopCommunitiesCard />
          <PremiumCard />
        </aside>
      </div>
    </div>
  );
};

export default CSSModules(Home, styles, {
  allowMultiple: true,
  handleNotFoundStyleName: "log",
});

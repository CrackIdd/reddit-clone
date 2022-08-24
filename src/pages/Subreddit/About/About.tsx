import CSSModules from "react-css-modules";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import Card from "../../../components/Card/Card";
import CardHeader from "../../../components/CardHeader/CardHeader";
import { selectCommunityData } from "../../../features/subreddit/subredditSlice";
import { useAppSelector } from "../../../hooks/hooks";
import styles from "./About.module.css";
import moment from "moment";
import { TbCake } from "react-icons/tb";
import Article from "../../../components/Skeletons/Article";

const About: React.FC = () => {
  const communityData = useAppSelector(selectCommunityData);

  const data = useAppSelector(selectCommunityData);

  return (
    <Card>
      <CardHeader />
      {Object.keys(communityData).length !== 0 ? (
        <>
          <p styleName="about__description">{communityData.description}</p>
          <div styleName="about__members">
            <div styleName="about__block">
              <div styleName="about__number">
                {communityData.numberOfMembers?.toLocaleString()}
              </div>
              <div styleName="about__member">Members</div>
            </div>
            <div styleName="about__block">
              <div styleName="about__number">4</div>
              <div styleName="about__member">Online</div>
            </div>
          </div>
          <hr styleName="about__thematic-break"></hr>
          <div styleName="about__cakeday">
            <span styleName="about__icon"></span>
            <p styleName="about__date">
              <TbCake /> Created{" "}
              {moment(new Date(communityData.createdAt * 1000)).format(
                "MMM DD, YYYY"
              )}
            </p>
          </div>
          <Link to={`/r/${communityData.name}/submit`}>
            <button styleName="about__button about__button_type_create">
              Create Post
            </button>
          </Link>
          <hr styleName="about__thematic-break"></hr>
          <button styleName="about__button about__button_type_options">
            Community Options
            <IoIosArrowDown />
          </button>
        </>
      ) : (
        <Article
          animate={true}
          backgroundColor={"#333"}
          foregroundColor={"#999"}
          speed={1}
        />
      )}
    </Card>
  );
};

export default CSSModules(About, styles, {
  allowMultiple: true,
  handleNotFoundStyleName: "log",
});

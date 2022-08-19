import styles from "./Header.module.css";
import subredditLogo from "../../../assets/subreddit-logo.svg";
import classNames from "classnames";
import CSSModules from "react-css-modules";
import { useAppSelector } from "../../../hooks/hooks";
import { selectCommunityData } from "../../../features/subreddit/subredditSlice";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db, getUserId, isUserSignedIn } from "../../../firebase";

interface Props {
  subredditName: string | undefined;
}

const Header: React.FC<Props> = ({ subredditName }) => {
  const { name } = useAppSelector(selectCommunityData);

  async function joinCommunity() {
    if (isUserSignedIn()) {
      const userRef = doc(db, "users", `${getUserId()}`);
      await updateDoc(userRef, {
        communities: arrayUnion({ subredditName }),
      });
    }
    else {
      alert("SIGN IN TO JOIN COMMUNITY")
    }
  }

  return (
    <div styleName="header">
      <div styleName="header__background"></div>
      <div styleName="header__container">
        <div styleName="header__content">
          <img
            styleName="header__subreddit-picture"
            src={subredditLogo}
            alt="default subreddit logo"
          />
          <div styleName="header__title-container">
            <div styleName="header__title">
              <h1 styleName="header__subreddit-name">{name}</h1>
              <h2 styleName="header__subreddit-link">r/{name}</h2>
            </div>
            <div styleName="header__buttons">
              {/* <button styleName=assNames(s["header__button"], s["header__button_type"]>Join</button> */}
              <button styleName="header__button" onClick={joinCommunity}>
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSSModules(Header, styles, {
  allowMultiple: true,
  handleNotFoundStyleName: "log",
});

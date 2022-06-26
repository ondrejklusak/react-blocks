import { ChangeEvent, FunctionComponent, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const StartPage: FunctionComponent = () => {
  const [canProceed, setCanProceed] = useState(false);

  const ctx = useContext(AppContext);

  const nameChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    ctx.setPlayer(event.target.value);
    if (event.target.value.length > 0 && !canProceed) {
      setCanProceed(true);
    } else if (event.target.value.length === 0) {
      setCanProceed(false);
    }
  };

  return (
    <form className="start-form">
      <p>Name:</p>
      <input type="text" onChange={(value) => nameChangeHandler(value)}></input>
      <Link to="/game">
        <button type="submit" disabled={!canProceed}>
          Play
        </button>
      </Link>
    </form>
  );
};

export default StartPage;

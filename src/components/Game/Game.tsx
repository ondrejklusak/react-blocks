import { FunctionComponent, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Playground from "../Playground/Playground";
import classes from "./Game.module.css";

const Game: FunctionComponent = () => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [floatingText, setFloatingText] = useState("");
  const [blockingLayer, setBlockingLayer] = useState(false);

  const ctx = useContext(AppContext);
  const navigate = useNavigate();

  const addToScore = (addition: number): void => {
    setScore((prevState) => prevState + addition);
    setFloatingText("+" + addition);
    setTimeout(() => setFloatingText(""), 1000);
  };

  const decrementLives = (): void => {
    setLives((prevState) => prevState - 1);
    setFloatingText("Life lost -❤️");
    setTimeout(() => setFloatingText(""), 1000);
  };

  const navigateToStart = useCallback((): void => {
    if (!ctx.currentPlayer) {
      navigate("/");
    }
  }, [ctx.currentPlayer, navigate]);

  useEffect(() => {
    if (lives <= 0) {
      ctx.addScoreToLeaderboard(score);
      navigate("/leaderboard", { replace: true });
    }
  }, [lives, navigate, ctx, score]);

  useEffect(() => {
    navigateToStart();
  }, [navigateToStart]);

  return (
    <div className={classes.game}>
      <div className={classes.header}>
        <div>❤️ Lives: {lives}</div>
        <div>✨ Score: {score}</div>
      </div>
      <Playground addScore={addToScore} isAnimating={(value) => setBlockingLayer(value)} onRoundEnd={decrementLives} />
      {blockingLayer && <div className={classes.blockingLayer}></div>}
      {floatingText.length > 0 && <div className={classes.floatingText}>{floatingText}</div>}
    </div>
  );
};

export default Game;

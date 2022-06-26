import { FunctionComponent, useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import classes from "./Leaderboard.module.css";

const Leaderboard: FunctionComponent = () => {
  const ctx = useContext(AppContext);
  return (
    <div className={classes.leaderboard}>
      <div className={classes.title}>Leaderboard</div>
      <table className={classes.table}>
        <thead>
          <tr>
            <th className={classes.headerCell}>Player</th>
            <th className={classes.headerCell}>Score</th>
          </tr>
        </thead>
        <tbody>
          {ctx.leaderboard
            .sort((a, b) => {
              if (a.score > b.score) return -1;
              if (a.score < b.score) return 1;
              return 0;
            })
            .map((item, index) => (
              <tr key={index}>
                <td className={classes.cell}>{item.player}</td>
                <td className={classes.cell}>{item.score}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <Link to="/">
        <button>Play again</button>
      </Link>
    </div>
  );
};

export default Leaderboard;

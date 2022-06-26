import { createContext, useState, FunctionComponent, ReactNode } from "react";

type ScoreData = {
  player: string;
  score: number;
};

type AppContextProps = {
  currentPlayer: string | undefined;
  leaderboard: ScoreData[];
  addScoreToLeaderboard: (score: number) => void;
  setPlayer: (name: string) => void;
};

export const AppContext = createContext<AppContextProps>({
  currentPlayer: undefined,
  leaderboard: [],
  addScoreToLeaderboard: () => {},
  setPlayer: () => {},
});

export const AppContextProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const [currentPlayer, setCurrentPlayer] = useState<string | undefined>(undefined);
  const [leaderboard, setLeaderboard] = useState<ScoreData[]>([]);

  const addScoreToLeaderboard = (score: number): void => {
    setLeaderboard((prevState) => {
      const newState = [...prevState];
      newState.push({ player: currentPlayer ?? "unknown", score });
      return newState;
    });
  };

  const setPlayer = (name: string): void => {
    setCurrentPlayer(name);
  };

  const appContext = {
    currentPlayer,
    leaderboard,
    addScoreToLeaderboard,
    setPlayer,
  };

  return <AppContext.Provider value={appContext}>{children}</AppContext.Provider>;
};

export default AppContextProvider;

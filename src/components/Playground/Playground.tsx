import { FunctionComponent, useCallback, useEffect, useState } from "react";
import Block from "../Block/Block";
import classes from "./Playground.module.css";

const SIZE_X = 5;
const SIZE_Y = 3;
const COLORS = ["blue", "green", "red", "yellow", "purple"];

type BlockInfo = {
  x: number;
  y: number;
  color: string;
};

type PlaygroundProps = {
  addScore: (score: number) => void;
  isAnimating: (value: boolean) => void;
  onRoundEnd: () => void;
};

const Playground: FunctionComponent<PlaygroundProps> = ({ addScore, isAnimating, onRoundEnd }) => {
  const generatePlayground = useCallback((): string[][] => {
    const playground: string[][] = [];
    for (let indexX = 0; indexX < SIZE_X; indexX++) {
      playground[indexX] = [];
      for (let indexY = 0; indexY < SIZE_Y; indexY++) {
        playground[indexX][indexY] = getRandomColor();
      }
    }
    return playground;
  }, []);

  const getRandomColor = (): string => {
    return COLORS[Math.max(0, ~~((Math.random() * 100) / (100 / COLORS.length)))];
  };

  const endRound = useCallback((): void => {
    onRoundEnd();
    setPlayground(generatePlayground());
    setNewBlockCounts(new Array(SIZE_X).fill(SIZE_Y));
    setTimeout(() => {
      isAnimating(false);
    }, 500);
  }, [generatePlayground, isAnimating, onRoundEnd]);

  const handleBlockClick = (block: BlockInfo): void => {
    const blocksInShape = [block];
    findAdjacentBlocks(block, blocksInShape);
    if (blocksInShape.length > 1) {
      isAnimating(true);
      addScore(blocksInShape.length * 100);
      setBlocksToDestroy(blocksInShape);
    }
  };

  const findAdjacentBlocks = (block: BlockInfo, blocksInShape: BlockInfo[]) => {
    const tryAddBlock = (blockToAdd: BlockInfo) => {
      if (blockToAdd.color === block.color && !blocksInShape.find((b) => b.x === blockToAdd.x && b.y === blockToAdd.y)) {
        blocksInShape.push(blockToAdd);
        findAdjacentBlocks(blockToAdd, blocksInShape);
      }
    };

    if (block.x > 0) {
      const leftBlock = { x: block.x - 1, y: block.y, color: playground[block.x - 1][block.y] };
      tryAddBlock(leftBlock);
    }
    if (block.y > 0) {
      const upperBlock = { x: block.x, y: block.y - 1, color: playground[block.x][block.y - 1] };
      tryAddBlock(upperBlock);
    }
    if (block.x < SIZE_X - 1) {
      const rightBlock = { x: block.x + 1, y: block.y, color: playground[block.x + 1][block.y] };
      tryAddBlock(rightBlock);
    }
    if (block.y < SIZE_Y - 1) {
      const lowerBlock = { x: block.x, y: block.y + 1, color: playground[block.x][block.y + 1] };
      tryAddBlock(lowerBlock);
    }
  };

  const [playground, setPlayground] = useState(generatePlayground());

  /** Serves for disappearing animation */
  const [blocksToDestroy, setBlocksToDestroy] = useState<BlockInfo[] | undefined>(undefined);

  /** Serves for appearing animation */
  const [newBlockCounts, setNewBlockCounts] = useState<number[]>(new Array(SIZE_X).fill(SIZE_Y));

  const isMoveAvailable = useCallback((): boolean => {
    for (let indexX = 0; indexX < SIZE_X; indexX++) {
      for (let indexY = 0; indexY < SIZE_Y; indexY++) {
        if (indexX < SIZE_X - 1 && playground[indexX][indexY] === playground[indexX + 1][indexY]) {
          return true;
        }
        if (indexY < SIZE_Y - 1 && playground[indexX][indexY] === playground[indexX][indexY + 1]) {
          return true;
        }
      }
    }
    return false;
  }, [playground]);

  /** With the delay of blocks disappearing animation creates new blocks */
  useEffect(() => {
    if (blocksToDestroy) {
      const countOfNew: number[] = [];
      setTimeout(() => {
        setPlayground((prevState) => {
          const newState: string[][] = [];
          for (let indexX = 0; indexX < SIZE_X; indexX++) {
            newState[indexX] = [];
            countOfNew[indexX] = 0;
            for (let indexY = 0; indexY < SIZE_Y; indexY++) {
              if (blocksToDestroy.findIndex((b) => b.x === indexX && b.y === indexY) === -1) {
                newState[indexX].push(prevState[indexX][indexY]);
              }
            }
            while (newState[indexX].length < SIZE_Y) {
              countOfNew[indexX]++;
              newState[indexX].unshift(getRandomColor());
            }
          }

          return newState;
        });
        setBlocksToDestroy(undefined);
        setNewBlockCounts(countOfNew);
      }, 1000);
    }
  }, [blocksToDestroy]);

  /** With the delay of appeearing of blocks animation ends a round if no move is available, else ends the state of animation */
  useEffect(() => {
    // sum of new blocks > 0
    if (newBlockCounts.reduce((a, b) => a + b, 0) > 0) {
      setTimeout(() => {
        if (!isMoveAvailable()) {
          setNewBlockCounts(new Array(SIZE_X).fill(0));
          setTimeout(() => {
            endRound();
          }, 1000);
        } else {
          setNewBlockCounts(new Array(SIZE_X).fill(0));
          isAnimating(false);
        }
      }, 500);
    }
  }, [newBlockCounts, isAnimating, isMoveAvailable, onRoundEnd, generatePlayground, endRound]);

  return (
    <div className={classes.playground}>
      {playground.map((arr, indexX) => (
        <div className={classes.column} key={indexX}>
          {arr.map((value, indexY) => (
            <Block
              key={indexY}
              color={value}
              onClick={() => handleBlockClick({ x: indexX, y: indexY, color: value })}
              toDestroy={!!blocksToDestroy?.find((b) => b.x === indexX && b.y === indexY)}
              isNew={newBlockCounts[indexX] > indexY}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Playground;

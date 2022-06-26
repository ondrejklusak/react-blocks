import { FunctionComponent } from "react";
import classes from "./Block.module.css";

type BlockProps = {
  /** Color of a block */
  color: string;
  /** A block is marked for destroying and is disapperaing */
  toDestroy: boolean;
  /** A block is marked as new and is apperaing */
  isNew: boolean;
  onClick: () => void;
};

const Block: FunctionComponent<BlockProps> = ({ color, toDestroy, isNew, onClick }) => {
  const blockClasses = [classes.block, classes[color]];
  if (toDestroy) {
    blockClasses.push(classes.disappearing);
  }
  if (isNew) {
    blockClasses.push(classes.new);
  }

  return <div className={blockClasses.join(" ")} onClick={onClick}></div>;
};

export default Block;

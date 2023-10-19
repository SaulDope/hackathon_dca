import React, { useState, useRef, useEffect } from "react";
import UpdateModal from "./UpdateModal";
import CollectModal from "./CollectModal";

type Position = {
  buying: string;
  paying: string;
  buy: string;
  bought: string;
  left: string;
  actions: string;
};

const PositionsData: Position[] = [
  {
    buying: "WBTC",
    paying: "USDC",
    buy: "$100/1D",
    bought: "$200",
    left: "8 (800 USDC)",
    actions: "WITHDRAW",
  },
  {
    buying: "ETH",
    paying: "USDC",
    buy: "$100/1W",
    bought: "$100",
    left: "9 (900 USDC)",
    actions: "WITHDRAW",
  },
  {
    buying: "UNI",
    paying: "USDC",
    buy: "$100/1H",
    bought: "$300",
    left: "7 (700 USDC)",
    actions: "WITHDRAW",
  },
  {
    buying: "LINK",
    paying: "USDC",
    buy: "$100/2D",
    bought: "$400",
    left: "6 (600 USDC)",
    actions: "WITHDRAW",
  },
];

type PositionsProps = {
  onActionClick: () => void;
};

const Positions: React.FC<PositionsProps> = ({ onActionClick }) => {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isCollectModalOpen, setCollectModalOpen] = useState(false);

  const handleUpdateClick = (position: Position) => {
    onActionClick();
    setUpdateModalOpen(true);
  };

  const handleCollectClick = (position: Position) => {
    onActionClick();
    setCollectModalOpen(true);
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>BUYING</th>
            <th>PAYING</th>
            <th>BUY</th>
            <th>BOUGHT</th>
            <th>BUYS REMAINING</th>
            <th colSpan={2}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {PositionsData.map((position, index) => (
            <tr key={index}>
              <td>{position.buying}</td>
              <td>{position.paying}</td>
              <td>{position.buy}</td>
              <td>{position.bought}</td>
              <td>{position.left}</td>
              <td>
                <button onClick={() => handleUpdateClick(position)}>
                  UPDATE
                </button>
              </td>
              <td>
                <button onClick={() => handleCollectClick(position)}>
                  COLLECT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      />
      <CollectModal
        isOpen={isCollectModalOpen}
        onClose={() => setCollectModalOpen(false)}
      />
    </>
  );
};

export default Positions;

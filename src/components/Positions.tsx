import React from "react";

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
  return (
    <table>
      <thead>
        <tr>
          <th>BUYING</th>
          <th>PAYING</th>
          <th>BUY</th>
          <th>BOUGHT</th>
          <th>BUYS REMAINING</th>
          <th>ACTIONS</th>
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
              <button onClick={onActionClick}>{position.actions}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Positions;

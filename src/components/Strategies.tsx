import React from "react";

type Strategy = {
  buying: string;
  paying: string;
  dex: string;
  timePerBuy: string;
  avgFeesPerBuy: string;
  actions: string;
};

const strategiesData: Strategy[] = [
  {
    buying: "WBTC",
    paying: "USDC",
    dex: "UNISWAP",
    timePerBuy: "2D",
    avgFeesPerBuy: "300 BLOCKS",
    actions: "DEPOSIT",
  },
  {
    buying: "WETH",
    paying: "USDC",
    dex: "UNISWAP",
    timePerBuy: "4H",
    avgFeesPerBuy: "300 BLOCKS",
    actions: "DEPOSIT",
  },
  {
    buying: "LINK",
    paying: "USDC",
    dex: "UNISWAP",
    timePerBuy: "1W",
    avgFeesPerBuy: "300 BLOCKS",
    actions: "DEPOSIT",
  },
  {
    buying: "UNI",
    paying: "USDC",
    dex: "UNISWAP",
    timePerBuy: "1D",
    avgFeesPerBuy: "300 BLOCKS",
    actions: "DEPOSIT",
  },
];

type StrategiesProps = {
  onActionClick: () => void;
};

const Strategies: React.FC<StrategiesProps> = ({ onActionClick }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>BUYING</th>
          <th>PAYING</th>
          <th>DEX</th>
          <th>TIME/BUY</th>
          <th>NEXT BUY</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {strategiesData.map((strategy, index) => (
          <tr key={index}>
            <td>{strategy.buying}</td>
            <td>{strategy.paying}</td>
            <td>{strategy.dex}</td>
            <td>{strategy.timePerBuy}</td>
            <td>{strategy.avgFeesPerBuy}</td>
            <td>
              <button onClick={onActionClick}>{strategy.actions}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Strategies;

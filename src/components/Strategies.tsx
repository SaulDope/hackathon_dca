import React, { useState, useRef, useEffect } from "react";
import DepositModal from "./DepositModal";

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
  const [isModalOpen, setModalOpen] = useState(false); // 2. Maintain a state
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleActionClick = (strategy: Strategy) => {
    onActionClick(); // call the parent's action
    setModalOpen(true); // open the modal
  };

  return (
    <>
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
                <button onClick={() => handleActionClick(strategy)}>
                  DEPOSIT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DepositModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Strategies;

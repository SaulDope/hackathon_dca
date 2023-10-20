import React, { useState, useRef, useEffect } from "react";
import DepositModal from "./DepositModal";

export type Strategy = {
  buyingToken: string;
  paymentToken: string;
  dex: string;
  blocksPerPeriod: string;
  lastBuyBlock: string;
  actions: string;
};

const strategiesData: Strategy[] = [
  {
    buyingToken: "WBTC",
    paymentToken: "USDC",
    dex: "UNISWAP",
    blocksPerPeriod: "2D",
    lastBuyBlock: "300 BLOCKS",
    actions: "DEPOSIT",
  },
  {
    buyingToken: "WETH",
    paymentToken: "USDC",
    dex: "UNISWAP",
    blocksPerPeriod: "4H",
    lastBuyBlock: "300 BLOCKS",
    actions: "DEPOSIT",
  },
  {
    buyingToken: "LINK",
    paymentToken: "USDC",
    dex: "UNISWAP",
    blocksPerPeriod: "1W",
    lastBuyBlock: "300 BLOCKS",
    actions: "DEPOSIT",
  },
  {
    buyingToken: "UNI",
    paymentToken: "USDC",
    dex: "UNISWAP",
    blocksPerPeriod: "1D",
    lastBuyBlock: "300 BLOCKS",
    actions: "DEPOSIT",
  },
];

type StrategiesProps = {
  onActionClick: () => void;
};

const Strategies: React.FC<StrategiesProps> = ({ onActionClick }) => {
  const [isDepositModalOpen, setDepositModalOpen] = useState(false); // 2. Maintain a state
  const modalRef = useRef<HTMLDivElement | null>(null);

  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(
    null
  );
  const handleActionClick = (strategy: Strategy) => {
    onActionClick(); // call the parent's action
    setSelectedStrategy(strategy); // set the selected strategy
    setDepositModalOpen(true); // open the modal
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
              <td>{strategy.buyingToken}</td>
              <td>{strategy.paymentToken}</td>
              <td>{strategy.dex}</td>
              <td>{strategy.blocksPerPeriod}</td>
              <td>{strategy.lastBuyBlock}</td>
              <td>
                <button onClick={() => handleActionClick(strategy)}>
                  DEPOSIT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        selectedStrategy={selectedStrategy}
      />
    </>
  );
};

export default Strategies;

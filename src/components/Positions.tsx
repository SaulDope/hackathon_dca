import React, { useState, useRef, useEffect } from "react";
import UpdateModal from "./UpdateModal";

export type Position = {
  buyingToken: string;
  paymentToken: string;
  perBuyAmount: string;
  buyPeriod: string;
  originalPaymentBalance: number;
  payingBalanceRemaining: number;
};

const PositionsData: Position[] = [
  {
    buyingToken: "WBTC",
    paymentToken: "USDC",
    perBuyAmount: "100",
    buyPeriod: "1H",
    originalPaymentBalance: 1000,
    payingBalanceRemaining: 900,
  },
  {
    buyingToken: "ETH",
    paymentToken: "USDC",
    perBuyAmount: "200",
    buyPeriod: "1D",
    originalPaymentBalance: 1000,
    payingBalanceRemaining: 800,
  },
  {
    buyingToken: "UNI",
    paymentToken: "USDC",
    perBuyAmount: "300",
    buyPeriod: "2D",
    originalPaymentBalance: 900,
    payingBalanceRemaining: 600,
  },
  {
    buyingToken: "LINK",
    paymentToken: "USDC",
    perBuyAmount: "400",
    buyPeriod: "1W",
    originalPaymentBalance: 800,
    payingBalanceRemaining: 400,
  },
];

type PositionsProps = {
  onActionClick: () => void;
};

const Positions: React.FC<PositionsProps> = ({ onActionClick }) => {
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );

  const handleUpdateClick = (position: Position) => {
    setSelectedPosition(position); // Set the selected position
    onActionClick();
    setUpdateModalOpen(true);
  };

  const handleCollectClick = (position: Position) => {
    setSelectedPosition(position); // Set the selected position
    console.log("collect");
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
              <td>{position.buyingToken}</td>
              <td>{position.paymentToken}</td>
              <td>
                {position.perBuyAmount}/{position.buyPeriod}
              </td>
              <td>
                {Number(position.originalPaymentBalance) -
                  Number(position.payingBalanceRemaining)}
              </td>
              <td>
                {Number(position.payingBalanceRemaining) /
                  Number(position.perBuyAmount)}{" "}
                ({position.payingBalanceRemaining} {position.paymentToken}){" "}
              </td>
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
        position={selectedPosition} // Pass the selected position as a prop
      />
    </>
  );
};

export default Positions;

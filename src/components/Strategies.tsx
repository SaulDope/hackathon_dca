import React, { useState, useRef, useEffect } from "react";
import DepositModal from "./DepositModal";
import { useBlockNumber } from "wagmi";

type Strategy = {
  buying: string;
  paying: string;
  dex: string;
  timePerBuy: string;
  avgFeesPerBuy: number;
  actions: string;
};

const strategiesData: Strategy[] = [
  {
    buying: "WBTC",
    paying: "USDC",
    dex: "UNISWAP",
    timePerBuy: "2D",
    avgFeesPerBuy: 86431,
    actions: "DEPOSIT",
  },
  {
    buying: "WETH",
    paying: "USDC",
    dex: "1INCH",
    timePerBuy: "4H",
    avgFeesPerBuy: 7219,
    actions: "DEPOSIT",
  },
  {
    buying: "LINK",
    paying: "USDC",
    dex: "QUICKSWAP",
    timePerBuy: "1W",
    avgFeesPerBuy: 302454,
    actions: "DEPOSIT",
  },
  {
    buying: "UNI",
    paying: "USDC",
    dex: "UNISWAP",
    timePerBuy: "1D",
    avgFeesPerBuy: 43221,
    actions: "DEPOSIT",
  },
];

type StrategiesProps = {
  onActionClick: () => void;
  data: any;
};

const Strategies: React.FC<StrategiesProps> = ({ onActionClick, data }) => {
  const [isModalOpen, setModalOpen] = useState(false); // 2. Maintain a state
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [payingToken, setPayingToken] = useState<string>("");
  const [buyingToken, setBuyingToken] = useState<string>("");
  const [choice, setChoice] = useState<number>(0);
  const { data: curBlockNum, isSuccess: curBlockSuccess } = useBlockNumber({
    watch: true,
  });

  const handleActionClick = (ind: number) => {
    onActionClick(); // call the parent's action
    if (ind == 0 || ind == 1) {
      setPayingToken("0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889");
      setBuyingToken("0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa");
      setModalOpen(true); // open the modal
      setChoice(ind);
    } else {
      setPayingToken("");
      setBuyingToken("");
      setChoice(0);
    }
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
          <tr key={"real_1"}>
            <td>WETH</td>
            <td>WMATIC</td>
            <td>UNISWAP</td>
            <td>1MIN</td>
            <td>{30 - (Number(curBlockNum) % 30)} BLOCKS</td>
            <td>
              <button onClick={() => handleActionClick(0)}>DEPOSIT</button>
            </td>
          </tr>
          <tr key={"real_2"}>
            <td>WETH</td>
            <td>WMATIC</td>
            <td>UNISWAP</td>
            <td>1H</td>
            <td>{1802 - (Number(curBlockNum) % 1802)} BLOCKS</td>
            <td>
              <button onClick={() => handleActionClick(1)}>DEPOSIT</button>
            </td>
          </tr>
          {strategiesData.map((strategy, index) => (
            <tr key={index}>
              <td>{strategy.buying}</td>
              <td>{strategy.paying}</td>
              <td>{strategy.dex}</td>
              <td>{strategy.timePerBuy}</td>
              <td>
                {strategy.avgFeesPerBuy -
                  (Number(curBlockNum) % strategy.avgFeesPerBuy)}{" "}
                BLOCKS
              </td>
              <td>
                <button onClick={() => handleActionClick(index + 2)}>
                  DEPOSIT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DepositModal isOpen={isModalOpen} choice={choice} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Strategies;

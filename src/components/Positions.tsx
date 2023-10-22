import React, { useState, useRef, useEffect } from "react";
import UpdateModal from "./UpdateModal";
import CollectModal from "./CollectModal";
import {
  useDeCaListUserPositions,
  useDeCaUserBuyInfos,
  useDeCaWithdrawOrCollect,
  usePrepareDeCaWithdrawOrCollect,
} from "../generated";
import { bigZero } from "./Tables";
import { useAccount } from "wagmi";
import { getContractConfig } from "./Body";

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
    buying: "WETH",
    paying: "WMATIC",
    buy: "0.05/1MIN",
    bought: "0.0143 WETH",
    left: "8 (.4 WMATIC)",
    actions: "WITHDRAW",
  },
];

type PositionsProps = {
  onActionClick: () => void;
};

const Positions: React.FC<PositionsProps> = ({ onActionClick }) => {
  const { address: userAddr } = useAccount();
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [isCollectModalOpen, setCollectModalOpen] = useState(false);
  const [positionsData, setPositionsData] = useState([]);
  const contractConfig = getContractConfig();

  const handleUpdateClick = (position: Position) => {
    onActionClick();
    setUpdateModalOpen(true);
  };

  const handleCollectClick = (position: Position) => {
    onActionClick();
    setCollectModalOpen(true);
  };

  const { config: withdrawPrepareConfig } = usePrepareDeCaWithdrawOrCollect({
    args: [bigZero, userAddr, false],
    ...contractConfig,
  });
  const collectWriter = useDeCaWithdrawOrCollect({
    ...withdrawPrepareConfig,
  });

  const positionsDataRead = useDeCaListUserPositions({
    args: [userAddr],
    ...contractConfig,
  });
  useEffect(() => {
    if (positionsDataRead.isSuccess) {
      setPositionsData(
        positionsDataRead != undefined && positionsDataRead.data != undefined
          ? positionsDataRead.data
          : []
      );
    }
  }, [positionsDataRead.data, positionsDataRead.isSuccess]);

  console.log(positionsDataRead);
  console.log(positionsData);

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
              <td>
                {positionsData.length != 0
                  ? (Number(positionsData[0].perBuyAmount) / 1e18).toFixed(5)
                  : position.buy}
              </td>
              <td>
                {positionsData.length != 0
                  ? (Number(positionsData[0].buyingTokenOwed) / 1e18).toFixed(5)
                  : position.bought}
              </td>
              <td>
                {positionsData.length != 0
                  ? (
                      Number(positionsData[0].payingBalanceRemaining) / 1e18
                    ).toFixed(5)
                  : position.left}
              </td>
              {/* <td>
                <button onClick={() => handleUpdateClick(position)}>
                  UPDATE
                </button>
              </td> */}
              <td>
                <button onClick={() => collectWriter.write()}>COLLECT</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
      /> */}
      {/* <CollectModal
        isOpen={isCollectModalOpen}
        onClose={() => setCollectModalOpen(false)}
      /> */}
    </>
  );
};

export default Positions;

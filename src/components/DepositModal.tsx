import React, { useRef, useEffect, useState } from "react";
import {
  ierc20ABI,
  useDeCaUserUpdateStrategy,
  useIerc20BalanceOf,
  usePrepareDeCaUserUpdateStrategy,
} from "../generated";
import { getContractConfig } from "./Body";
import { bigZero } from "./Tables";
import { useAccount } from "wagmi";
import { useDebounce } from "@uidotdev/usehooks";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  choice: number;
};

const DepositModal: React.FC<ModalProps> = ({ isOpen, onClose, choice }) => {
  const modalContentRef = useRef<HTMLDivElement | null>(null); // 2. Initialize the ref
  const contractConfig = getContractConfig();
  const { address: userAddr } = useAccount();
  const [wethBal, setWethBal] = useState<bigint>(bigZero);
  const wethBalanceRead = useIerc20BalanceOf({
    args: [userAddr],
    address: "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa",
    abi: ierc20ABI,
  });
  useEffect(() => {
    if (wethBalanceRead.isSuccess) {
      setWethBal(wethBalanceRead.data ?? bigZero);
    }
  }, [wethBalanceRead.isSuccess, wethBalanceRead.data]);
  const [wmaticBal, setWmaticBal] = useState<bigint>(bigZero);
  const wmaticBalanceRead = useIerc20BalanceOf({
    args: [userAddr],
    address: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    abi: ierc20ABI,
  });
  useEffect(() => {
    if (wmaticBalanceRead.isSuccess) {
      setWmaticBal(wmaticBalanceRead.data ?? bigZero);
    }
  }, [wmaticBalanceRead.isSuccess, wmaticBalanceRead.data]);
  const sliderMin = 0;
  const sliderMax = Number(wmaticBal) / 1e18;
  const sliderStep = 0.001;
  const scaleFactor = 1 / sliderStep; // Adjust scale factor according to step value
  const [amountToBuy, setAmountToBuy] = useState<number>(0);
  const [epochsToBuy, setEpochsToBuy] = useState<number>(0);
  const debouncedAmount = useDebounce(amountToBuy, 750);
  const debouncedEpochs = useDebounce(epochsToBuy, 750);
  const [isPending, setIsPending] = useState<boolean>(false);
  const maxEpochs = Math.floor(
    amountToBuy > 0 ? Number(wmaticBal) / 1e18 / amountToBuy : 100
  );

  useEffect(() => {
    if (epochsToBuy > maxEpochs) {
      setEpochsToBuy(maxEpochs);
    }
  });

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value) / scaleFactor;
    setAmountToBuy(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setAmountToBuy(newValue);
  };

  const handleEpochsToBuyInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = parseInt(event.target.value, 10);
    setEpochsToBuy(newValue);
  };

  //    function userUpdateStrategy(uint256 strategyId, uint256 newBuyAmount, uint256 desiredPaymentBalance, uint256 epochsToBuy) public payable {
  const { config: depositPrepareConfig } = usePrepareDeCaUserUpdateStrategy({
    args: [
      BigInt(choice),
      BigInt(debouncedAmount * 1e18),
      BigInt(debouncedAmount * 1e18 * epochsToBuy),
      BigInt(debouncedEpochs),
    ],
    value: bigZero,
    ...contractConfig,
  });
  const buyWriter = useDeCaUserUpdateStrategy({
    onSettled: (d, e) => {
      setIsPending(false);
      setAmountToBuy(0);
      setEpochsToBuy(0);
    },
    ...depositPrepareConfig,
  });

  console.log(depositPrepareConfig);
  console.log(buyWriter);

  useEffect(() => {
    // 3. Event listener function
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]); // Pass the onClose function as a dependency

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content" ref={modalContentRef}>
        {" "}
        {/* 4. Attach the ref */}
        {/* Sample content */}
        <div className="modal-header">
          <h2>Deposit</h2>
          <button onClick={onClose} className="close-btn">
            X
          </button>
        </div>
        <div className="modal-body">
          <span>Amount per Buy</span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Slider component */}
            <input
              type="range"
              min={sliderMin * scaleFactor}
              max={sliderMax * scaleFactor}
              step={sliderStep * scaleFactor} // this ensures the slider can step in decimals
              value={amountToBuy * scaleFactor}
              onChange={handleSliderChange}
              style={{ marginRight: "10px" }}
            />
            {/* Number input box */}
            <input
              type="number"
              value={amountToBuy}
              onChange={handleInputChange}
              style={{ width: "60px", marginRight: "5px" }} // Adjust the width as needed
            />
            <span>{(Number(wmaticBal) / 1e18).toFixed(5)} WMATIC</span>
          </div>{" "}
          <span>Number of Buys</span>
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            {/* Slider component */}
            <input
              type="range"
              min="0"
              max={maxEpochs}
              value={epochsToBuy}
              onChange={handleEpochsToBuyInputChange}
              style={{ marginRight: "10px" }}
            />
            {/* Number input box */}
            <input
              type="number"
              value={epochsToBuy}
              onChange={handleEpochsToBuyInputChange}
              style={{ width: "60px" }} // Adjust the width as needed
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <hr style={{ width: "100%" }}></hr>
            <span
              style={{
                display: amountToBuy == 0 || epochsToBuy == 0 ? "none" : "",
              }}
            >
              ({amountToBuy.toFixed(5)} WMATIC * {epochsToBuy}) BUYS ={" "}
              {(amountToBuy * epochsToBuy).toFixed(5)} WMATIC
            </span>
            <button
              onClick={() => {
                if (buyWriter !== undefined) {
                  buyWriter.write();
                }
                setIsPending(true);
              }}
            >
              START BUYING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;

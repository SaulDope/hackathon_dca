import React, { useRef, useEffect, useState, useCallback } from "react";
import { Strategy } from "./Strategies";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedStrategy: Strategy | null;
};

const DepositModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  selectedStrategy,
}) => {
  const [buyingPerPeriod, setBuyingPerPeriod] = useState<number | string>("");
  const [amount, setAmount] = useState<number | string>("");
  const [isAssetApproved, setIsAssetApproved] = useState<boolean>(false);
  const [isAmountValid, setIsAmountValid] = useState<boolean>(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleAmountBlur = () => {
    if (!amount || !buyingPerPeriod) {
      setIsAmountValid(false);
      return;
    }

    if (buyingPerPeriod && Number(amount) % Number(buyingPerPeriod) !== 0) {
      setIsAmountValid(false);
    } else {
      setIsAmountValid(true);
    }
  };

  const depositLogic = (
    buyingPerPeriod: number | string,
    amount: number | string
  ) => {
    console.log("deposit", {
      buyingPerPeriod,
      amount,
    });
  };

  const handleClose = useCallback(() => {
    setBuyingPerPeriod("");
    setAmount("");
    setIsAssetApproved(false);
    setIsAmountValid(false);
    onClose();
  }, [onClose]);

  const modalContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content" ref={modalContentRef}>
        <div className="modal-header">
          <h2>DEPOSIT</h2>
          <button onClick={handleClose} className="close-btn">
            X
          </button>
        </div>
        <div className="modal-body">
          {selectedStrategy && (
            <p>
              STRATEGY: {selectedStrategy.buyingToken}-
              {selectedStrategy.paymentToken}
              {selectedStrategy.blocksPerPeriod}
            </p>
          )}
          <div className="input-group">
            <p>BUYING PER PERIOD:</p>
            <input
              type="number"
              className="input-field"
              value={buyingPerPeriod}
              onChange={(e) => setBuyingPerPeriod(Number(e.target.value))}
            />
            <p>AMOUNT:</p>
            <input
              type="number"
              className="input-field"
              value={amount}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
            />
          </div>

          <button
            className="deposit-button"
            disabled={!isAmountValid || (!buyingPerPeriod && !amount)}
            onClick={() =>
              isAssetApproved
                ? depositLogic(Number(buyingPerPeriod), Number(amount))
                : setIsAssetApproved(true)
            }
            style={{
              cursor: isAmountValid ? "pointer" : "not-allowed",
            }}
          >
            {isAssetApproved ? "UPDATE" : "APPROVE"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;

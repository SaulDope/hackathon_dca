import React, { useRef, useEffect, useState, useCallback } from "react";
import { Position } from "./Positions";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  position: Position | null;
};

const UpdateModal: React.FC<ModalProps> = ({ isOpen, onClose, position }) => {
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const [transactionType, setTransactionType] = useState<
    "Deposit" | "Withdraw"
  >("Deposit");
  const [inputValue, setInputValue] = useState("");
  const [buyingPerPeriod, setBuyingPerPeriod] = useState<string>("");

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  const handleBuyingPerPeriodChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBuyingPerPeriod(e.target.value);
    },
    []
  );

  const isUpdateButtonDisabled = useCallback(() => {
    if (!position) return true;
    return (
      (buyingPerPeriod === position.perBuyAmount && !inputValue) ||
      (!buyingPerPeriod && !inputValue)
    );
  }, [position, buyingPerPeriod, inputValue]);

  useEffect(() => {
    if (isOpen && position) {
      setBuyingPerPeriod(position.perBuyAmount);
    }
  }, [isOpen, position]);

  useEffect(() => {
    if (
      position &&
      transactionType === "Withdraw" &&
      parseFloat(inputValue) > position.payingBalanceRemaining
    ) {
      setInputValue(position.payingBalanceRemaining.toString());
    }
    if (!isOpen) {
      setInputValue("");
      setTransactionType("Deposit");
    }
  }, [transactionType, inputValue, position, isOpen]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const updateLogic = useCallback(
    (
      buyingPerPeriod: number,
      depositWithdrawAmount: number,
      transactionType: "Deposit" | "Withdraw",
      originalPerBuyAmount: number
    ) => {
      console.log("update", {
        buyingPerPeriod,
        depositWithdrawAmount,
        transactionType,
        originalPerBuyAmount,
      });
    },
    []
  );

  const handleUpdateClick = useCallback(() => {
    if (position) {
      updateLogic(
        parseFloat(buyingPerPeriod),
        parseFloat(inputValue),
        transactionType,
        parseFloat(position.perBuyAmount)
      );
    }
  }, [buyingPerPeriod, inputValue, transactionType, updateLogic, position]);

  if (!isOpen) return null;
  return (
    <div className="modal">
      <div className="modal-content" ref={modalContentRef}>
        <div className="modal-header">
          <h2>UPDATE</h2>
          <button onClick={onClose} className="close-btn">
            X
          </button>
        </div>
        <div className="modal-body">
          {position && (
            <>
              <p>
                STRATEGY: {position.buyingToken}-{position.paymentToken}{" "}
                {position.perBuyAmount}/{position.buyPeriod}
              </p>
              <p>
                PAYING REMAINING: {position.payingBalanceRemaining}{" "}
                {position.paymentToken}
              </p>

              <div className="input-group">
                <p>BUYING PER PERIOD:</p>
                <input
                  type="number"
                  className="input-field buying-per-period-input"
                  value={buyingPerPeriod}
                  onChange={handleBuyingPerPeriodChange}
                />
                <p>DEPOSIT/WITHDRAW PAYING ASSET:</p>
                <input
                  type="number"
                  className="input-field deposit-withdraw-input"
                  value={inputValue}
                  onChange={handleInputChange}
                  max={
                    transactionType === "Withdraw"
                      ? position.payingBalanceRemaining.toString()
                      : undefined
                  }
                />

                <label className="radio-label">
                  <input
                    type="radio"
                    value="Deposit"
                    checked={transactionType === "Deposit"}
                    onChange={(e) =>
                      setTransactionType(
                        (e.target as HTMLInputElement).value as
                          | "Deposit"
                          | "Withdraw"
                      )
                    }
                  />
                  DEPOSIT
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="Withdraw"
                    checked={transactionType === "Withdraw"}
                    onChange={(e) =>
                      setTransactionType(
                        (e.target as HTMLInputElement).value as
                          | "Deposit"
                          | "Withdraw"
                      )
                    }
                  />
                  WITHDRAW
                </label>
              </div>

              <button
                className="update-button"
                onClick={handleUpdateClick}
                disabled={isUpdateButtonDisabled()}
              >
                UPDATE
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;

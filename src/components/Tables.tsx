"use client";
import React, { useState, useRef, useEffect } from "react";

import Strategies from "./Strategies";
import Positions from "./Positions";
import { getContractConfig } from "./Body";
import { useBlockNumber } from "wagmi";
import { useDeCaListStrategies, useDeCaStrategyCounter } from "../generated";

export const bigZero = BigInt(0);
export const bigOne = BigInt(1);

const Tables = () => {
  const [activeTab, setActiveTab] = useState<string>("strategies");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [strategyCount, setStrategyCount] = useState<bigint>(bigZero);
  const [strategyData, setStrategyData] = useState();
  const contractConfig = getContractConfig();
  const { data: curBlockNum, isSuccess: curBlockSuccess } = useBlockNumber({
    watch: true,
  });
  console.log(curBlockNum);
  const strategyCounterRead = useDeCaStrategyCounter(contractConfig);
  console.log(strategyCounterRead);
  useEffect(() => {
    if (strategyCounterRead.isSuccess) {
      setStrategyCount(strategyCounterRead.data ?? bigZero);
    }
  }, [strategyCounterRead.isSuccess, strategyCounterRead.data]);

  const strategiesDataRead = useDeCaListStrategies({
    args: [bigZero, bigOne],
    watch: true,
    ...contractConfig,
  });
  console.log(strategiesDataRead);
  useEffect(() => {
    if (strategiesDataRead.isSuccess) {
      setStrategyData(
        strategiesDataRead != undefined && strategiesDataRead.data != undefined
          ? strategiesDataRead.data
          : []
      );
    }
  }, [strategiesDataRead.data, strategiesDataRead.isSuccess]);

  console.log(strategyCount);
  console.log(strategyData);

  return (
    <div className="tabs">
      <div className="tab-headers">
        <div
          className={`tab-header ${activeTab === "strategies" ? "active" : ""}`}
          onClick={() => setActiveTab("strategies")}
        >
          STRATEGIES
        </div>
        <div
          className={`tab-header ${activeTab === "positions" ? "active" : ""}`}
          onClick={() => setActiveTab("positions")}
        >
          POSITIONS
        </div>
      </div>

      {activeTab === "strategies" && (
        <Strategies
          onActionClick={() => setModalOpen(true)}
          data={strategyData}
        />
      )}

      {activeTab === "positions" && (
        <Positions onActionClick={() => setModalOpen(true)} />
      )}
    </div>
  );
};

export default Tables;

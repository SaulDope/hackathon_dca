"use client";
import React, { useState, useRef, useEffect } from "react";

type Strategy = {
  name: string;
  pair: string;
  dex: string;
  buysPerDay: string;
  avgFeesPerBuy: string;
  actions: string;
};

const strategiesData: Strategy[] = [
  {
    name: "WBTC",
    pair: "WBTC-USDC",
    dex: "UNISWAP",
    buysPerDay: "4",
    avgFeesPerBuy: "0.01 ETH",
    actions: "DEPOSIT",
  },
  {
    name: "ETH",
    pair: "ETH-USDC",
    dex: "UNISWAP",
    buysPerDay: "3",
    avgFeesPerBuy: "0.005 ETH",
    actions: "DEPOSIT",
  },
  {
    name: "LINK",
    pair: "LINK-USDC",
    dex: "UNISWAP",
    buysPerDay: "2",
    avgFeesPerBuy: "0.002 ETH",
    actions: "DEPOSIT",
  },
  {
    name: "UNI",
    pair: "UNI-USDC",
    dex: "UNISWAP",
    buysPerDay: "5",
    avgFeesPerBuy: "0.015 ETH",
    actions: "DEPOSIT",
  },
];

const Tables = () => {
  const [activeTab, setActiveTab] = useState<string>("strategies");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      isModalOpen &&
      modalRef.current &&
      !modalRef.current.contains(event.target as Node)
    ) {
      setModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

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
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>ASSET</th>
              <th>DEX</th>
              <th>BUYS/DAY</th>
              <th>AVG FEES/BUY</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {strategiesData.map((strategy, index) => (
              <tr key={index}>
                <td>{strategy.name}</td>
                <td>{strategy.pair}</td>
                <td>{strategy.dex}</td>
                <td>{strategy.buysPerDay}</td>
                <td>{strategy.avgFeesPerBuy}</td>
                <td>
                  <button onClick={() => setModalOpen(true)}>
                    {strategy.actions}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "positions" && (
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>ASSET</th>
              <th>DEPOSITED</th>
              <th>BOUGHT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>{/* Position rows will be here */}</tbody>
        </table>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal" ref={modalRef}>
          <div className="modal-header">
            <h2>Deposit</h2>
            <button onClick={() => setModalOpen(false)} className="close-btn">
              X
            </button>
          </div>
          <div className="modal-content">
            {/* Add modal content here */}
            <p>Deposit modal functions</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tables;

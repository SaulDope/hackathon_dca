"use client";
import React, { useState, useRef, useEffect } from "react";

import Strategies from "./Strategies";
import Positions from "./Positions";

const Tables = () => {
  const [activeTab, setActiveTab] = useState<string>("strategies");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

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
        <Strategies onActionClick={() => setModalOpen(true)} />
      )}

      {activeTab === "positions" && (
        <Positions onActionClick={() => setModalOpen(true)} />
      )}
    </div>
  );
};

export default Tables;

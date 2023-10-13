"use client";

import React, { useState, useRef, useEffect } from "react";
import { BaseError } from "viem";
import { useAccount, useConnect } from "wagmi";
import { Account } from "./Account";

export function Connect() {
  const { connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  // New state to manage the modal's visibility
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: { target: any }) {
      // If showModal is true and the click is outside the modal, then close the modal
      if (
        showModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setShowModal(false);
      }
    }

    // Attach the click listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return (
    <div>
      {isConnected ? (
        <>
          <Account />
        </>
      ) : (
        <button className="connect-btn" onClick={() => setShowModal(true)}>
          <img src="/wallet.png" alt="Wallet Icon" />
          CONNECT WALLET
        </button>
      )}

      {/* Wallet provider modal */}
      {showModal && (
        <div className="modal" ref={modalRef}>
          <div className="modal-header">
            <h2>
              <img src="/wallet-white.png" alt="Wallet Icon" />
              CONNECT WALLET
            </h2>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ×
            </button>
          </div>
          <div className="modal-content">
            <p>CHOOSE A WALLET TO CONNECT.</p>
            {connectors
              .filter((x) => x.ready && x.id !== connector?.id)
              .map((x) => (
                <div
                  key={x.id}
                  className="wallet-option"
                  onClick={() => {
                    connect({ connector: x });
                    setShowModal(false);
                  }}
                >
                  <img src={`/${x.name.toLowerCase()}.svg`} alt={x.name} />
                  {x.name.toUpperCase()}
                  {isLoading &&
                    x.id === pendingConnector?.id &&
                    " (connecting)"}
                </div>
              ))}
          </div>
          <div className="modal-footer"></div>
        </div>
      )}

      {error && <div>{(error as BaseError).shortMessage}</div>}
    </div>
  );
}

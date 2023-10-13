"use client";

import { useAccount, useNetwork, useSwitchNetwork, useDisconnect } from "wagmi";
import { useState, useRef, useEffect } from "react";

export function Account() {
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  const { disconnect } = useDisconnect();

  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  const networkModalRef = useRef(null);
  const accountModalRef = useRef(null);

  function shortenAddress(addr: string) {
    if (addr.length <= 8) {
      return addr; // If the address is too short, return as is
    }
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  }

  useEffect(() => {
    function handleClickOutside(event: { target: any }) {
      if (
        showNetworkModal &&
        networkModalRef.current &&
        !networkModalRef.current.contains(event.target)
      ) {
        setShowNetworkModal(false);
      }

      if (
        showAccountModal &&
        accountModalRef.current &&
        !accountModalRef.current.contains(event.target)
      ) {
        setShowAccountModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNetworkModal, showAccountModal]);

  return (
    <div>
      <div className="button-group">
        <button
          className="connect-btn"
          onClick={() => setShowNetworkModal(true)}
        >
          {chain?.name && (
            <img src={`/${chain.name.toLowerCase()}.svg`} alt={chain.name} />
          )}
          {chain?.name?.toUpperCase() ?? chain?.id}
        </button>
        <button
          className="connect-btn"
          onClick={() => setShowAccountModal(true)}
        >
          {shortenAddress(address)}
        </button>
      </div>

      {showNetworkModal && (
        <div className="modal" ref={networkModalRef}>
          <div className="modal-header">
            <h2>SWITCH NETWORKS</h2>
            <button
              className="close-btn"
              onClick={() => setShowNetworkModal(false)}
            >
              ×
            </button>
          </div>
          <div className="modal-content">
            {switchNetwork && (
              <div>
                {chains.map((x) =>
                  x.id === chain?.id ? null : (
                    <div
                      key={x.id}
                      className="wallet-option"
                      onClick={() => {
                        switchNetwork(x.id);
                        setShowNetworkModal(false);
                      }}
                    >
                      <img src={`/${x.name.toLowerCase()}.svg`} alt={x.name} />
                      {x.name.toUpperCase()}
                      {isLoading && x.id === pendingChainId && " (SWITCHING)"}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showAccountModal && (
        <div className="modal" ref={accountModalRef}>
          <div className="modal-header">
            <h2>ACCOUNT</h2>
            <button
              className="close-btn"
              onClick={() => setShowAccountModal(false)}
            >
              ×
            </button>
          </div>
          <div className="modal-content">
            <div className="wallet-option" onClick={disconnect}>
              <img src="/logout.png" alt="Wallet Icon" />
              {`DISCONNECT WALLET`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

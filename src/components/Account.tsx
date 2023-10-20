"use client";

import {
  useAccount,
  useNetwork,
  useSwitchNetwork,
  useDisconnect,
  useBalance,
} from "wagmi";
import { useState, useRef, useEffect } from "react";

export function Account() {
  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();
  const { disconnect } = useDisconnect();

  const { data } = useBalance({
    address: address,
  });

  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const networkModalRef = useRef<HTMLDivElement | null>(null);
  const accountModalRef = useRef<HTMLDivElement | null>(null);
  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds sir
    }
  };

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
          {chain?.name?.includes(chain.id.toString()) ? (
            <>
              <img src="/unknown.png" />
              {chain.name}
            </>
          ) : (
            <>
              <img src={`/${chain?.name.toLowerCase()}.svg`} />
              {chain?.name.toUpperCase()}
            </>
          )}
        </button>
        <button
          className="connect-btn"
          onClick={() => setShowAccountModal(true)}
        >
          {address ? shortenAddress(address) : "No Address"}
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
                {/* Current connected network */}
                <div className="wallet-option">
                  {chain?.name.includes(chain.id.toString()) ? (
                    <>
                      <img src="/unknown.png" />
                      {chain.name}
                    </>
                  ) : (
                    <>
                      <img src={`/${chain?.name.toLowerCase()}.svg`} />
                      {chain?.name.toUpperCase()}
                    </>
                  )}
                  <span className="connected-indicator">
                    CONNECTED <span className="green-dot"></span>
                  </span>
                </div>

                {/* Other available networks */}
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
                      <img src={`/${x.name.toLowerCase()}.svg`} />
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
            <p>
              {" "}
              BALANCE:{" "}
              {data?.formatted
                ? `${parseFloat(data?.formatted).toFixed(4)} ${data?.symbol}`
                : "Loading..."}
            </p>
            <div className="wallet-option" onClick={copyToClipboard}>
              <img src="/copy.png" alt="Copy Address" />
              <span>
                {isCopied ? "Copied!" : address ? address : "No Address"}
              </span>
            </div>
            <div
              className="wallet-option"
              onClick={(e) => {
                e.preventDefault();
                disconnect();
              }}
            >
              <img src="/logout.png" />
              {`DISCONNECT WALLET`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

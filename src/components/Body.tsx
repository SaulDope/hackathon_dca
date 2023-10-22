"use client";

import Tables from "../components/Tables";
import { useAccount, useConnect } from "wagmi";
import { deCaABI, useDeCaStrategyCounter } from "../generated";
import { useState } from "react";

const addrType = "ff";
const polygonMumbaiContractAddr =
  "0x9997C2a043E7135360dA1B44eEf62408A065295F" as `0x${typeof addrType}`;
export function getContractConfig() {
  return {
    address: polygonMumbaiContractAddr,
    abi: deCaABI,
  };
}

export function Body() {
  const { connector, isConnected } = useAccount();

  return (
    <div>
      {isConnected ? (
        <>
          <Tables />
        </>
      ) : (
        <>
          <div className="homepage">
            <header>
              <h1>Introducing Onchain DCA</h1>
              <p>Automate Your Crypto Investments</p>
            </header>

            <section className="introduction">
              <h2>Simple and Smart</h2>
              <p>
                Onchain DCA (Dollar-Cost Averaging) offers a straightforward
                approach to managing your crypto investments.
              </p>
            </section>

            <section className="how-it-works">
              <h2>How it Works</h2>
              <ul>
                <li>
                  <strong>Admin-Initialized Pairs:</strong> Pairs are set up by
                  administrators, possibly through governance mechanisms, like
                  Uniswap's wETH/BTC pair.
                </li>
                <li>
                  <strong>Daily Buys:</strong> Each pair starts with a daily buy
                  of 0, a buy balance of 0, and a buy ID of 0.
                </li>
                <li>
                  <strong>User Deposits:</strong> Users deposit funds along with
                  the amount they want to buy per day.
                </li>
                <li>
                  <strong>Automated Buys:</strong> Tokens are bought once a day
                  with the amount purchased recorded.
                </li>
                <li>
                  <strong>User Allocation:</strong> The user's buy and the
                  overall buy are allocated as a percentage to the user.
                </li>
                <li>
                  <strong>Withdrawal:</strong> Calculate the amount to withdraw
                  for each user by looping through each day's buys.
                </li>
              </ul>
            </section>

            <section className="example-scenario">
              <h2>Example Scenario</h2>
              <p>
                Alice deposits 10 WETH with a daily buy of 0.25 WETH, resulting
                in a total daily buy of 1 ETH. The buy ID for her first purchase
                is 25. As she buys more, the owed RLB is calculated based on her
                percentage of the total buys.
              </p>
            </section>

            <section className="caveats-ideas">
              <h2>Caveats and Ideas</h2>
              <ul>
                <li>
                  <strong>Efficient Data Structure:</strong> Explore efficient
                  data structures, like trees, to optimize the looping process.
                </li>
                <li>
                  <strong>Changing Buy Allocation:</strong> Users changing their
                  buy allocation are required to withdraw all bought tokens.
                </li>
                <li>
                  <strong>Managing User Deposits:</strong> Ensure the user buy
                  multiplied by the number of buys since deposit does not exceed
                  their deposit amount.
                </li>
                <li>
                  <strong>MEV Consideration:</strong> Distribute buys across
                  multiple DEXs to avoid MEV exploitation.
                </li>
                <li>
                  <strong>Epoch Updates:</strong> Optimize gas usage by allowing
                  "epoch" updates for cumulative amounts.
                </li>
                <li>
                  <strong>Token and Fee Strategy:</strong> Consider governance
                  tokens, flat deposit fees, dynamic withdrawal fees, and
                  strategies to handle high gas conditions.
                </li>
                <li>
                  <strong>Keeper Fees:</strong> Majority of fees go to keepers
                  to trigger buys, with extra fees potentially going to the
                  protocol.
                </li>
              </ul>
            </section>

            <section className="join-now">
              <h2>Join Onchain DCA Today</h2>
              <p>Simplify your crypto investment strategy with Onchain DCA!</p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default Body;

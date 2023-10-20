"use client";

import Tables from "../components/Tables";
import { useAccount, useConnect } from "wagmi";

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
              <h1>Introducing DeCA</h1>
              <p>Automate Your Crypto Investments</p>
            </header>

            <section className="introduction">
              <h2>Simple and Smart</h2>
              <p>
                DeCA (Decentralized Cost Averaging) offers a straightforward
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
              <ul>
                <li> Alice deposits 10 wETH, daily buy is .25 wETH, for RLB</li>
                <li> Total daily buy w/ user is at 1 ETH</li>
                <li> Next Buy id at users deposit is 25</li>
                <li> Buy 25: 1 ETH for 100 RLB</li>
                <li> Buy 26: 1 ETH for 80 RLB</li>
                <li>
                  {" "}
                  Before buy 27, a different user Bob withdraws their .5 ETH of
                  daily buy
                </li>
                <li> Buy 27: .5 ETH for 46 RLB</li>
                <li> Buy 28: .5 ETH for 54 RLB</li>
                <li> Another user Charlie adds 1.5 ETH to daily buy</li>
                <li> Buy 29: 2 ETH for 208 RLB</li>
                <li>
                  {" "}
                  Alice wants to withdraw, so we calculate the following:
                </li>
                <li>
                  {" "}
                  Day 25-26 she was 25% (.25/1) of a total of 180 RLB bought,
                  180*.25 = 45
                </li>
                <li>
                  {" "}
                  Day 27-28 she was 50% (.25/.5) of 100 bought, 100*.5 = 50
                </li>
                <li> Day 29 she was 12.5% of 208 bought, owed 26</li>
                <li>Total owed: 121 RLB</li>
              </ul>
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
              <h2>Join DeCA Today</h2>
              <p>Simplify your crypto investment strategy with DeCA!</p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default Body;

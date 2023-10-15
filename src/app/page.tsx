import { Connect } from "../components/Wallet";
import Tables from "../components/Tables";
import "../styles/styles.css";

export function Page() {
  return (
    <div>
      <div className="header">
        <div className="logo-section">
          <img src="/logo-white.png" className="logo" />
          <span>DCA ONCHAIN</span>
        </div>
        <div className="wallet-section">
          <Connect />
        </div>
      </div>
      <Tables />
    </div>
  );
}

export default Page;

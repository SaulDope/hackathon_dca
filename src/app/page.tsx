import { Connect } from "../components/Wallet";
import "../styles/styles.css";

export function Page() {
  return (
    <div className="header">
      <div className="logo-section">
        <img src="/logo-white.png" className="logo" />
        <span>DCA ONCHAIN</span>
      </div>
      <div className="wallet-section">
        <Connect />
      </div>
    </div>
  );
}

export default Page;

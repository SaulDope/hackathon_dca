import { Connect } from "../components/Wallet";

export function Header() {
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
    </div>
  );
}

export default Header;

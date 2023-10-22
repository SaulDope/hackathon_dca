import { Connect } from "../components/Wallet";

export function Header() {
  return (
    <div className="header">
      <div className="logo-section">
        <img src="/logo-white.png" className="logo" />
        <span>DeCA</span>
      </div>
      <div className="wallet-section">
        <Connect />
      </div>
    </div>
  );
}

export default Header;

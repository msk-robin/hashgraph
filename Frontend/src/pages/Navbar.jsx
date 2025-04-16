import { Link } from "react-router-dom";
import React from "react";
import HederaConnectButton from "../components/HederaConnectButton";
import hashguardLogo from "../assets/hashguard.svg";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <img src={hashguardLogo} alt="HashGuard" className="h-8 w-auto" />
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/settings" className="hover:text-blue-600">
                Settings
              </Link>
              <Link to="/about" className="hover:text-blue-600">
                About
              </Link>
              <Link to="/history" className="hover:text-blue-600">
                History
              </Link>
              <Link to="/faq" className="hover:text-blue-600">
                FAQ
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <HederaConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

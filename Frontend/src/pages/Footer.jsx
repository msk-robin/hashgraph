import { Link } from "react-router-dom";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">HashGuard</h3>
            <p className="text-gray-400">
              Enterprise-grade security layer for Hedera Hashgraph networks.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/settings" className="hover:text-white">
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white">
                  History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="https://hedera.com"
                  target="_blank"
                  className="hover:text-white"
                >
                  Hedera Docs
                </Link>
              </li>
              <li>
                <Link
                  to="https://github.com/msk-robin/hashgraph"
                  target="_blank"
                  className="hover:text-white"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2025 HashGuard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

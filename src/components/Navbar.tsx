import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Cpu } from 'lucide-react';
import { Button } from './Button';
import { midnightService } from '../services/midnightService';
import { WALLET_HELPER_TEXT } from '../utils/proofStatus';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [walletState, setWalletState] = useState(midnightService.getWalletState());
  const [account, setAccount] = useState(midnightService.getActiveAccount());

  useEffect(() => {
    const handleConnect = (data: any) => {
      setWalletState('Connected');
      setAccount(data.account);
    };
    const handleDisconnect = () => {
      setWalletState('Disconnected');
      setAccount(null);
    };

    // Initial sync
    setWalletState(midnightService.getWalletState());
    setAccount(midnightService.getActiveAccount());

    midnightService.subscribeWalletEvents('wallet connected', handleConnect);
    midnightService.subscribeWalletEvents('wallet disconnected', handleDisconnect);
    return () => {
      midnightService.unsubscribeWalletEvents('wallet connected', handleConnect);
      midnightService.unsubscribeWalletEvents('wallet disconnected', handleDisconnect);
    };
  }, []);

  const handleConnectWallet = async () => {
    if (walletState === 'Connected') {
      await midnightService.disconnectWallet();
    } else {
      try {
        await midnightService.connectWallet();
      } catch (err: any) {
        alert(err.message || 'Failed to connect wallet.');
      }
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Live Audit Session', path: '/live-audit' },
    { label: 'Report Details', path: '/report' },
    { label: 'AI Summary', path: '/ai-summary' },
    { label: 'Investor Access', path: '/investor' },
    { label: 'About Midnight', path: '/about-midnight' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#121212] border-b border-[#242424]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded bg-primary flex items-center justify-center">
              <Cpu className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-tight text-sm leading-none">
                Ghost<span className="text-zinc-450">Audit</span>
              </span>
              <span className="text-[8px] uppercase tracking-wider text-zinc-500 font-medium font-mono mt-0.5">
                Privacy-preserving due diligence
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-sm text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'text-white bg-zinc-800'
                      : 'text-zinc-450 hover:text-white hover:bg-zinc-900/60'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* CTA & Mobile Hamburger */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant={walletState === 'Connected' ? 'secondary' : 'primary'} 
              size="sm" 
              onClick={handleConnectWallet}
              className="font-mono text-[10px]"
              title={walletState === 'Connected' ? 'Disconnect Midnight Wallet' : WALLET_HELPER_TEXT}
            >
              {walletState === 'Connected' 
                ? `Wallet: ${account ? account.substring(0, 6) + '...' + account.substring(account.length - 4) : 'Connected'}` 
                : 'Connect Midnight Wallet'}
            </Button>
            <Link to="/live-audit">
              <Button variant="secondary" size="sm">
                Session Audit
              </Button>
            </Link>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#242424] bg-[#0A0A0A] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-white bg-zinc-900'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-950'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="flex flex-col gap-2 pt-4">
            <Button 
              variant={walletState === 'Connected' ? 'secondary' : 'primary'} 
              size="sm" 
              onClick={() => {
                setIsOpen(false);
                handleConnectWallet();
              }}
              className="w-full font-mono text-[10px]"
              title={walletState === 'Connected' ? 'Disconnect Midnight Wallet' : WALLET_HELPER_TEXT}
            >
              {walletState === 'Connected' 
                ? `Wallet: ${account ? account.substring(0, 6) + '...' + account.substring(account.length - 4) : 'Connected'}` 
                : 'Connect Midnight Wallet'}
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/live-audit" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="secondary" size="sm" className="w-full">
                  Session Audit
                </Button>
              </Link>
              <Link to="/investor" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="primary" size="sm" className="w-full">
                  Access Registry
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

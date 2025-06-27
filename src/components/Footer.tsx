import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 bg-black">
      <div className="flex items-center justify-center gap-12 py-2">
        <a
          href="https://bolt.new/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity"
        >
          <img 
            src="/bolt-logo copy copy.png" 
            alt="Bolt" 
            className="w-4 h-4 object-contain"
          />
          <span className="text-white">
            Bolt
          </span>
        </a>

        <a
          href="https://www.revenuecat.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity"
        >
          <img 
            src="/revenuecat-logo copy copy copy.svg" 
            alt="RevenueCat" 
            className="w-4 h-4 object-contain"
          />
          <span className="text-white">
            RevenueCat
          </span>
        </a>

        <a
          href="https://supabase.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs hover:opacity-70 transition-opacity"
        >
          <div className="w-4 h-4 rounded flex items-center justify-center bg-green-500">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="text-white">
            Supabase
          </span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
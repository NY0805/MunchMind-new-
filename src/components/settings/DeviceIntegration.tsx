import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, Check, X, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';

const DeviceIntegration = () => {
  const { connectedDevices, setConnectedDevices } = useUser();
  const { theme } = useTheme();
  const [showScanModal, setShowScanModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  // Disable background scrolling when modal is open
  useEffect(() => {
    if (showScanModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showScanModal]);

  const toggleConnection = (id: number) => {
    setConnectedDevices(connectedDevices.map(device => 
      device.id === id 
        ? { ...device, connected: !device.connected } 
        : device
    ));
  };

  const handleScanDevices = () => {
    setShowScanModal(true);
    setIsScanning(true);
    setScanProgress(0);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const closeScanModal = () => {
    setShowScanModal(false);
    setIsScanning(false);
    setScanProgress(0);
  };

  return (
    <>
      <div className={`rounded-lg overflow-hidden shadow-md ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-4">
          <h3 className={`font-semibold text-lg mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Device Integration
          </h3>
          
          <div className="mb-4">
            <button 
              onClick={handleScanDevices}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                theme === 'synesthesia'
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              } transition-colors`}
            >
              <Wifi size={18} />
              <span>Scan for New Devices</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {connectedDevices.map((device) => (
              <div 
                key={device.id} 
                className={`flex justify-between items-center p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone size={20} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                  <div>
                    <p className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                      {device.name}
                    </p>
                    <p className={`text-xs ${
                      device.connected
                        ? 'text-green-500'
                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {device.connected ? 'Connected' : 'Disconnected'}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => toggleConnection(device.id)}
                  className={`p-2 rounded-full ${
                    device.connected
                      ? theme === 'dark' 
                        ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                      : theme === 'dark'
                        ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  } transition-colors`}
                >
                  {device.connected ? <Check size={18} /> : <X size={18} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Scanning Modal */}
      {showScanModal && (
        <div className="modal-overlay" onClick={closeScanModal}>
          <div 
            className={`modal-content modal-small animate-modal-in ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 text-center ${
              theme === 'synesthesia'
                ? 'bg-gradient-to-br from-purple-500 to-indigo-500'
                : 'bg-gradient-to-br from-blue-500 to-cyan-500'
            } text-white`}>
              <Search size={32} className="mx-auto mb-2 animate-pulse" />
              <h2 className="text-lg font-bold">Scanning for Devices</h2>
              <p className="text-white/90 text-sm">Looking for nearby smart devices...</p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <div className={`w-full h-2 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      theme === 'synesthesia'
                        ? 'bg-purple-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                <p className={`text-center mt-2 text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {scanProgress}% Complete
                </p>
              </div>

              {isScanning ? (
                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
                }`}>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                  }`}>
                    🔍 Searching for smart kitchen appliances...
                  </p>
                </div>
              ) : (
                <div className={`p-3 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'
                }`}>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-700'
                  }`}>
                    ✅ Scan complete! No new devices found.
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-4">
                {isScanning ? (
                  <button
                    onClick={closeScanModal}
                    className={`flex-1 py-2 rounded-full font-medium ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    } transition-colors`}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={closeScanModal}
                    className={`flex-1 py-2 rounded-full font-medium ${
                      theme === 'synesthesia'
                        ? 'bg-purple-500 hover:bg-purple-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } transition-colors`}
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeviceIntegration;
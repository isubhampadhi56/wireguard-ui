import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import nacl from 'tweetnacl';
import { Buffer } from 'buffer';
import {InputBox} from '../components/input-fields';

export default function WireGuardClientConfig() {
  const { darkMode, toggleTheme } = useTheme();
  const [clientIp, setClientIp] = useState('10.0.0.2/32');
  const [serverPublicKey, setServerPublicKey] = useState('');
  const [serverEndpoint, setServerEndpoint] = useState('vpn.example.com:51820');
  const [allowedIps, setAllowedIps] = useState('0.0.0.0/0');
  const [dns, setDns] = useState('1.1.1.1');
  const [persistentKeepalive, setPersistentKeepalive] = useState(25);
  const [config, setConfig] = useState('');
  const [clientPublicKey, setClientPublicKey] = useState('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [filename, setFilename] = useState('wireguard');
  const modalRef = useRef<HTMLDivElement>(null);

  const handleDownloadClick = () => {
    if (filename) {
      const blob = new Blob([config], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.conf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowDownloadModal(false);
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setShowDownloadModal(false);
    }
  };

  const generateConfig = () => {
    // Generate key pair
    const raw = nacl.box.keyPair();

    // WireGuard uses only the first 32 bytes of secretKey
    const privateKey = Buffer.from(raw.secretKey).toString('base64');
    const publicKey =Buffer.from(raw.publicKey).toString('base64');

    const conf = `
[Interface]
PrivateKey = ${privateKey}
Address = ${clientIp}
DNS = ${dns}

[Peer]
PublicKey = ${serverPublicKey}
Endpoint = ${serverEndpoint}
AllowedIPs = ${allowedIps}
PersistentKeepalive = ${persistentKeepalive}
    `.trim();

    setConfig(conf);
    setClientPublicKey(publicKey);
  };

  return (
    <motion.div className={`max-w-2xl mx-auto p-6 space-y-6 min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-evenly items-center">
        <h1 className="text-3xl font-bold">WireGuard Client Config Generator</h1>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg shadow p-6`}>
        <div className="space-y-4">
          <div>
            <InputBox data={clientIp} setData={setClientIp} label="Client IP" darkMode={darkMode}></InputBox>
          </div>
          <div>
            <InputBox data={serverPublicKey} setData={setServerPublicKey} label="Server Public Key" darkMode={darkMode}></InputBox>
          </div>
          <div>
            <InputBox data={serverEndpoint} setData={setServerEndpoint} label="Server Endpoint" darkMode={darkMode}></InputBox>
          </div>
          <div>
            <InputBox data={allowedIps} setData={setAllowedIps} label="Allowed IPs" darkMode={darkMode}></InputBox>
          </div>
          <div>
            <InputBox data={dns} setData={setDns} label="DNS" darkMode={darkMode}></InputBox>
          </div>
          <div>
            <InputBox data={persistentKeepalive} setData={setPersistentKeepalive} label="Persistent Keepalive" darkMode={darkMode}></InputBox>
          </div>
          <button className={`w-full py-2 px-4 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800'} text-white`} onClick={generateConfig}>Generate Config</button>
        </div>
      </div>

      {config && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border rounded-lg shadow p-4`}>
            <label className={`block font-medium mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>Generated Config</label>
            <textarea 
              rows={12} 
              readOnly 
              value={config} 
              className={`w-full font-mono text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 border-gray-300'} border rounded p-2`} 
            />
            <button 
              onClick={() => setShowDownloadModal(true)}
              className={`w-full py-2 px-4 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800'} text-white`}
            >
              Download Config
            </button>

            {showDownloadModal && (
              <div 
                ref={modalRef}
                className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={handleModalClick}
              >
                <div className={`${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} rounded-lg shadow-xl p-6 w-full max-w-md border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>Download Configuration</h2>
                  <div className="mb-4">
                    <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Filename (without extension)</label>
                    <input
                      type="text"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className={`w-full px-3 py-2 rounded ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'} border`}
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowDownloadModal(false)} 
                      className={`px-4 py-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDownloadClick}
                      className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800'} text-white`}
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className={`text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            🔑 Client Public Key: <code className="font-mono">{clientPublicKey}</code>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

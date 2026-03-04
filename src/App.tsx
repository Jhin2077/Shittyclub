/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { Monitor, Network, Trash2, FileText, Folder, UserPlus, UploadCloud, AlertTriangle, X, Play, Square, Pause, FastForward, Rewind } from 'lucide-react';

type WindowId = 'movie' | 'games' | 'music' | 'readme' | 'register' | 'upload' | 'ad' | 'error' | 'pines_town' | 'donation' | 'pixelator';

let audioCtx: AudioContext | null = null;

export const playSound = (type: 'click' | 'error' | 'open' | 'close') => {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, now);
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      osc.start(now);
      osc.stop(now + 0.02);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
      
      const osc2 = audioCtx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(180, now);
      osc2.connect(gainNode);
      osc2.start(now);
      osc2.stop(now + 0.5);

      const osc3 = audioCtx.createOscillator();
      osc3.type = 'sawtooth';
      osc3.frequency.setValueAtTime(210, now);
      osc3.connect(gainNode);
      osc3.start(now);
      osc3.stop(now + 0.5);
    } else if (type === 'open') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'close') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

interface WindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isFocused: boolean;
  zIndex: number;
}

const WindowComponent = ({ id, title, children, onClose, onFocus, zIndex, defaultPos, defaultSize }: any) => {
  return (
    <Rnd
      default={{
        x: defaultPos.x,
        y: defaultPos.y,
        width: defaultSize?.width || 400,
        height: defaultSize?.height || 'auto',
      }}
      minWidth={300}
      bounds="parent"
      onMouseDown={onFocus}
      style={{ zIndex, position: 'absolute' }}
      dragHandleClassName="title-bar"
    >
      <div className="window" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="title-bar">
          <div className="title-bar-text">{title}</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" onClick={() => playSound('click')} />
            <button aria-label="Maximize" onClick={() => playSound('click')} />
            <button aria-label="Close" onClick={onClose} />
          </div>
        </div>
        <div className="window-body" style={{ flex: 1, overflow: 'auto', margin: 0, padding: '8px' }}>
          {children}
        </div>
      </div>
    </Rnd>
  );
};

const DesktopIcon = ({ emoji, label, onClick }: any) => (
  <div 
    className="flex flex-col items-center justify-start w-24 h-24 m-2 cursor-pointer text-white hover:bg-white/20 rounded p-2"
    onClick={() => playSound('click')}
    onDoubleClick={onClick}
  >
    <div className="text-4xl mb-2 drop-shadow-md select-none">{emoji}</div>
    <span className="text-xs text-center drop-shadow-md break-words w-full">{label}</span>
  </div>
);

export default function App() {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'movie', title: 'COT Media Player (SHITTY MOVIE)', isOpen: false, isFocused: false, zIndex: 1 },
    { id: 'games', title: 'Explorer - C:\\CURSED_ROM (SHITTY GAMES)', isOpen: false, isFocused: false, zIndex: 1 },
    { id: 'music', title: 'Winamp Skin (SHITTY MUSIC)', isOpen: false, isFocused: false, zIndex: 1 },
    { id: 'readme', title: 'Eat me.txt', isOpen: false, isFocused: false, zIndex: 1 },
    { id: 'register', title: '注册 / Register', isOpen: false, isFocused: false, zIndex: 1 },
    { id: 'upload', title: '上传 / Upload', isOpen: false, isFocused: false, zIndex: 1 },
    { id: 'ad', title: '垃圾广告 / Trash Ad', isOpen: true, isFocused: true, zIndex: 2 },
    { id: 'error', title: 'Fatal Error', isOpen: false, isFocused: false, zIndex: 1 },
    { id: 'pines_town', title: 'PINEWOOD.EXE', isOpen: false, isFocused: false, zIndex: 1 },
    { id: 'donation', title: '捐赠 / Donate', isOpen: false, isFocused: false, zIndex: 1 },
    { id: 'pixelator', title: 'SHITTY PIXELATOR (像素转换器)', isOpen: false, isFocused: false, zIndex: 1 },
  ]);

  const [maxZIndex, setMaxZIndex] = useState(2);
  const [time, setTime] = useState('');
  const [currentPath, setCurrentPath] = useState('C:\\CURSED_ROM');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(null);
  const [audioTitle, setAudioTitle] = useState('Stevie Wonder - Superstition');
  const [pixelImage, setPixelImage] = useState<string | null>(null);
  const [pixelSize, setPixelSize] = useState(8);
  const pixelCanvasRef = React.useRef<HTMLCanvasElement>(null);

  const fileSystem: Record<string, any[]> = {
    'C:\\CURSED_ROM': [
      { name: 'archives', size: '', type: 'File Folder', isFolder: true },
      { name: '0xDEADBEEF.rom', size: '666 KB', type: 'ROM File', isFolder: false },
      { name: 'GLITCH_MATRIX.exe', size: '42 MB', type: 'Application', isFolder: false },
      { name: 'PINEWOOD.EXE', size: '??? MB', type: 'Unknown', isFolder: false },
    ],
    'C:\\CURSED_ROM\\archives': [
      { name: '..', size: '', type: 'File Folder', isFolder: true },
      { name: 'DO_NOT_OPEN.exe', size: '999 MB', type: 'Application', isFolder: false },
      { name: 'blood.rom', size: '13 KB', type: 'ROM File', isFolder: false },
    ]
  };

  const handleFileDoubleClick = (file: any) => {
    if (file.isFolder) {
      playSound('click');
      if (file.name === '..') {
        setCurrentPath(currentPath.substring(0, currentPath.lastIndexOf('\\')));
      } else {
        setCurrentPath(`${currentPath}\\${file.name}`);
      }
    } else {
      if (file.name === 'PINEWOOD.EXE') {
        openWindow('pines_town');
      } else if (file.name.endsWith('.rom') || file.name.endsWith('.exe')) {
        openWindow('error');
      }
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (localAudioUrl) {
        URL.revokeObjectURL(localAudioUrl);
      }
      const url = URL.createObjectURL(file);
      setLocalAudioUrl(url);
      setAudioTitle(file.name);
      setIsMusicPlaying(true);
    }
  };

  const handlePixelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (pixelImage) {
        URL.revokeObjectURL(pixelImage);
      }
      const url = URL.createObjectURL(file);
      setPixelImage(url);
    }
  };

  const downloadPixelImage = () => {
    if (!pixelCanvasRef.current) return;
    const url = pixelCanvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shitty_pixel.png';
    a.click();
  };

  useEffect(() => {
    if (!pixelImage || !pixelCanvasRef.current) return;
    const canvas = pixelCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const MAX_WIDTH = 400;
      let width = img.width;
      let height = img.height;
      if (width > MAX_WIDTH) {
        height = Math.floor(height * (MAX_WIDTH / width));
        width = MAX_WIDTH;
      }
      canvas.width = width;
      canvas.height = height;

      // Calculate scaled dimensions
      const w = Math.max(1, Math.floor(width / pixelSize));
      const h = Math.max(1, Math.floor(height / pixelSize));

      // Create an off-screen canvas to draw the small image
      const offCanvas = document.createElement('canvas');
      offCanvas.width = w;
      offCanvas.height = h;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      // Draw small
      offCtx.drawImage(img, 0, 0, w, h);

      // Turn off image smoothing
      ctx.imageSmoothingEnabled = false;

      // Draw big
      ctx.drawImage(offCanvas, 0, 0, w, h, 0, 0, width, height);
    };
    img.src = pixelImage;
  }, [pixelImage, pixelSize]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const openWindow = (id: WindowId) => {
    if (id === 'error') {
      playSound('error');
    } else {
      playSound('open');
    }
    setWindows(windows.map(w => {
      if (w.id === id) {
        return { ...w, isOpen: true, isFocused: true, zIndex: maxZIndex + 1 };
      }
      return { ...w, isFocused: false };
    }));
    setMaxZIndex(maxZIndex + 1);
  };

  const closeWindow = (id: WindowId) => {
    playSound('close');
    if (id === 'music') setIsMusicPlaying(false);
    setWindows(windows.map(w => w.id === id ? { ...w, isOpen: false } : w));
  };

  const focusWindow = (id: WindowId) => {
    setWindows(windows.map(w => {
      if (w.id === id) {
        return { ...w, isFocused: true, zIndex: maxZIndex + 1 };
      }
      return { ...w, isFocused: false };
    }));
    setMaxZIndex(maxZIndex + 1);
  };

  const isWindowOpen = (id: WindowId) => windows.find(w => w.id === id)?.isOpen;
  const getWindowZIndex = (id: WindowId) => windows.find(w => w.id === id)?.zIndex || 1;

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#008080] font-sans select-none relative">
      {/* Desktop Icons */}
      <div className="flex flex-col flex-wrap h-[calc(100vh-32px)] p-2 content-start">
        <DesktopIcon emoji="🖥️" label="SHITTY MOVIE" onClick={() => openWindow('movie')} />
        <DesktopIcon emoji="🌐" label="SHITTY GAMES" onClick={() => openWindow('games')} />
        <DesktopIcon emoji="🗑️" label="SHITTY MUSIC" onClick={() => openWindow('music')} />
        <DesktopIcon emoji="💩" label="Eat me.txt" onClick={() => openWindow('readme')} />
        <DesktopIcon emoji="👥" label="注册 / Register" onClick={() => openWindow('register')} />
        <DesktopIcon emoji="📁" label="上传 / Upload" onClick={() => openWindow('upload')} />
        <DesktopIcon emoji="👾" label="SHITTY PIXELATOR" onClick={() => openWindow('pixelator')} />
      </div>

      {/* Windows */}
      {isWindowOpen('movie') && (
        <WindowComponent
          id="movie"
          title="COT Media Player (SHITTY MOVIE)"
          onClose={() => closeWindow('movie')}
          onFocus={() => focusWindow('movie')}
          zIndex={getWindowZIndex('movie')}
          defaultPos={{ x: 50, y: 50 }}
          defaultSize={{ width: 600, height: 400 }}
        >
          <div className="flex h-full gap-2">
            <div className="flex-1 flex flex-col bg-black border-[2px] border-gray-500 p-1">
              <div className="flex-1 bg-gray-900 flex items-center justify-center text-white text-xs overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/static/400/300')] bg-cover mix-blend-screen animate-pulse"></div>
                <span className="animate-bounce">NO SIGNAL / 信号丢失</span>
              </div>
              <div className="h-8 mt-2 flex items-center gap-2">
                <button className="px-2 py-1"><Play size={14} /></button>
                <button className="px-2 py-1"><Pause size={14} /></button>
                <button className="px-2 py-1"><Square size={14} /></button>
                <div className="flex-1 h-4 bg-gray-800 border-[inset] border-2 border-gray-600 relative">
                  <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-blue-800"></div>
                </div>
              </div>
            </div>
            <div className="w-48 bg-white border-[2px] border-gray-500 p-2 text-xs font-mono overflow-y-auto">
              <strong>Notepad.exe</strong>
              <hr className="my-1" />
              <p>鉴定意见 / Appraisal:</p>
              <p className="mt-2 text-red-600">该导演在拍摄时疑似处于降智状态，画面频率与人类脑电波不符。</p>
              <p className="mt-2 text-red-600">The director seemed to be in a state of intellectual degradation during filming. The frame rate does not match human brainwaves.</p>
              <p className="mt-4">-- Dr Jhin</p>
            </div>
          </div>
        </WindowComponent>
      )}

      {isWindowOpen('games') && (
        <WindowComponent
          id="games"
          title={`Explorer - ${currentPath} (SHITTY GAMES)`}
          onClose={() => closeWindow('games')}
          onFocus={() => focusWindow('games')}
          zIndex={getWindowZIndex('games')}
          defaultPos={{ x: 100, y: 100 }}
          defaultSize={{ width: 500, height: 350 }}
        >
          <div className="bg-white h-full border-[2px] border-gray-500 p-2 overflow-y-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="pb-1">Name / 名称</th>
                  <th className="pb-1">Size / 大小</th>
                  <th className="pb-1">Type / 类型</th>
                </tr>
              </thead>
              <tbody>
                {(fileSystem[currentPath] || []).map((file, idx) => (
                  <tr key={idx} className="cursor-pointer hover:bg-blue-600 hover:text-white group" onDoubleClick={() => handleFileDoubleClick(file)}>
                    <td className="py-1 flex items-center gap-1">
                      {file.isFolder ? <Folder size={14} /> : <FileText size={14} />} 
                      {file.name}
                    </td>
                    <td>{file.size}</td>
                    <td>{file.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 p-2 bg-yellow-200 border border-yellow-400 text-xs inline-block shadow-md transform rotate-2">
              <p><strong>COT Note:</strong> 这不是BUG，这TM就是这么设计的！</p>
              <p>This ain't a BUG. It’s fucking designed that way.</p>
            </div>
          </div>
        </WindowComponent>
      )}

      {isWindowOpen('music') && (
        <WindowComponent
          id="music"
          title="Winamp Skin (SHITTY MUSIC)"
          onClose={() => closeWindow('music')}
          onFocus={() => focusWindow('music')}
          zIndex={getWindowZIndex('music')}
          defaultPos={{ x: 150, y: 150 }}
          defaultSize={{ width: 350, height: 200 }}
        >
          <div className="bg-[#111] text-[#0f0] font-mono p-2 h-full flex flex-col border-[2px] border-gray-600">
            <div className="text-center text-xs mb-2 text-red-500 animate-pulse font-bold">
              WARNING: AUDITORY CONTAMINATION<br/>警告：听觉污染
            </div>
            <div className="flex-1 border border-[#0f0] p-1 flex items-end gap-1 mb-2">
              {/* Fake waveform */}
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-full bg-[#0f0]" style={{ height: `${Math.random() * 100}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="truncate flex-1 mr-2">{audioTitle}</span>
              <div className="flex gap-1">
                <button className="bg-gray-700 text-white px-2 py-1 border border-gray-500" title="Open Local File" onClick={() => { playSound('click'); document.getElementById('audio-upload')?.click(); }}>⏏️</button>
                <button className="bg-gray-700 text-white px-2 py-1 border border-gray-500" onClick={() => { playSound('click'); setIsMusicPlaying(false); }}><Rewind size={12}/></button>
                <button className="bg-gray-700 text-white px-2 py-1 border border-gray-500" onClick={() => { playSound('click'); setIsMusicPlaying(true); }}><Play size={12}/></button>
                <button className="bg-gray-700 text-white px-2 py-1 border border-gray-500" onClick={() => { playSound('click'); setIsMusicPlaying(false); }}><Pause size={12}/></button>
                <button className="bg-gray-700 text-white px-2 py-1 border border-gray-500" onClick={() => { playSound('click'); setIsMusicPlaying(false); }}><FastForward size={12}/></button>
              </div>
            </div>
            <input type="file" id="audio-upload" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
            {isMusicPlaying && (
              localAudioUrl ? (
                <audio src={localAudioUrl} autoPlay onEnded={() => setIsMusicPlaying(false)} className="hidden" />
              ) : (
                <iframe
                  width="0"
                  height="0"
                  src="https://www.youtube.com/embed/tIdIqbv7SPo?autoplay=1"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              )
            )}
          </div>
        </WindowComponent>
      )}

      {isWindowOpen('readme') && (
        <WindowComponent
          id="readme"
          title="Eat me.txt - Notepad"
          onClose={() => closeWindow('readme')}
          onFocus={() => focusWindow('readme')}
          zIndex={getWindowZIndex('readme')}
          defaultPos={{ x: 200, y: 200 }}
          defaultSize={{ width: 400, height: 300 }}
        >
          <textarea className="w-full h-full resize-none font-mono text-sm p-2 outline-none" readOnly value={`关于《松木镇怪谈》的模糊线索...
Vague clues about "Pines Town Urban Legend"...

1996年，松木镇发生了一起未解之谜。
In 1996, an unsolved mystery occurred in Pines Town.

所有的监控录像都显示着同样的雪花点。
All surveillance footage showed the same static.

如果你找到了 PINES_TOWN.exe，千万不要...
If you find PINES_TOWN.exe, whatever you do, do not...

[DATA EXPUNGED / 数据删除]`} />
        </WindowComponent>
      )}

      {isWindowOpen('register') && (
        <WindowComponent
          id="register"
          title="注册 / Register"
          onClose={() => closeWindow('register')}
          onFocus={() => focusWindow('register')}
          zIndex={getWindowZIndex('register')}
          defaultPos={{ x: 250, y: 150 }}
          defaultSize={{ width: 320, height: 280 }}
        >
          <div className="flex flex-col gap-3 p-2 text-sm">
            <p className="mb-2">加入 COT 探员名单 / Join COT Agent List</p>
            <div className="field-row">
              <label htmlFor="username">用户名 / User:</label>
              <input id="username" type="text" />
            </div>
            <div className="field-row">
              <label htmlFor="email">邮箱 / Email:</label>
              <input id="email" type="email" />
            </div>
            <div className="field-row">
              <label htmlFor="password">密码 / Pass:</label>
              <input id="password" type="password" />
            </div>
            <div className="field-row mt-2">
              <input id="agree" type="checkbox" />
              <label htmlFor="agree">我愿意承担过劳死风险 / I accept the risk of death from overwork 💀</label>
            </div>
            <button className="mt-4" onClick={() => closeWindow('register')}>
              提交注册 / Submit Registration
            </button>
          </div>
        </WindowComponent>
      )}

      {isWindowOpen('upload') && (
        <WindowComponent
          id="upload"
          title="上传 / Upload"
          onClose={() => closeWindow('upload')}
          onFocus={() => focusWindow('upload')}
          zIndex={getWindowZIndex('upload')}
          defaultPos={{ x: 300, y: 200 }}
          defaultSize={{ width: 350, height: 250 }}
        >
          <div className="flex flex-col gap-3 p-2 text-sm">
            <p>上传你的“烂货” / Upload your "Shitty" stuff</p>
            <div className="field-row">
              <label htmlFor="file">文件 / File:</label>
              <input id="file" type="file" />
            </div>
            <div className="field-row flex-col items-start gap-1">
              <label htmlFor="desc">描述 / Description:</label>
              <textarea id="desc" rows={3} className="w-full"></textarea>
            </div>
            <button className="mt-2" onClick={() => {
              openWindow('error');
              closeWindow('upload');
            }}>
              开始上传 / Start Upload
            </button>
          </div>
        </WindowComponent>
      )}

      {isWindowOpen('ad') && (
        <WindowComponent
          id="ad"
          title="SHITTY Ad"
          onClose={() => closeWindow('ad')}
          onFocus={() => focusWindow('ad')}
          zIndex={getWindowZIndex('ad')}
          defaultPos={{ x: window.innerWidth - 350, y: 50 }}
          defaultSize={{ width: 300, height: 200 }}
        >
          <div className="flex flex-col items-center justify-center h-full text-center bg-[#ff00ff] text-yellow-300 p-4 border-4 border-dashed border-yellow-300 animate-pulse cursor-pointer" onClick={() => { playSound('click'); openWindow('donation'); }}>
            <h2 className="text-xl font-bold mb-2 text-shadow">为大家垃圾作品充能！</h2>
            <h2 className="text-lg font-bold mb-4 text-shadow">Charge for everyone's shitty works!</h2>
            <p className="text-white text-sm bg-black p-1">捐赠 3 毛钱，您的 ID 就会出现在“牺牲探员名单”里。</p>
            <p className="text-white text-xs bg-black p-1 mt-1">Donate ￥0.3, your ID will appear on the "Sacrificed Agents List".</p>
            <button className="mt-4 px-4 py-2 bg-yellow-400 text-black font-bold border-2 border-white hover:bg-yellow-500">
              CLICK HERE / 点击这里
            </button>
          </div>
        </WindowComponent>
      )}

      {isWindowOpen('donation') && (
        <WindowComponent
          id="donation"
          title="捐赠 / Donate"
          onClose={() => closeWindow('donation')}
          onFocus={() => focusWindow('donation')}
          zIndex={getWindowZIndex('donation')}
          defaultPos={{ x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 200 }}
          defaultSize={{ width: 300, height: 400 }}
        >
          <div className="bg-white h-full flex flex-col items-center justify-center p-2 border-[2px] border-gray-500 overflow-y-auto">
            <div className="text-center mb-2">
              <h2 className="text-lg font-bold text-red-600">COT牺牲探员名单</h2>
              <p className="text-xs text-gray-600">￥0.30</p>
            </div>
            {/* Placeholder for the uploaded image. The user should replace this src with their actual image path */}
            <div className="w-full flex-1 border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-100 relative overflow-hidden">
               <img src="/donation-qr.png" alt="Donation QR Code" className="max-w-full max-h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
               <div className="text-center p-4 hidden">
                 <p className="text-xs text-gray-500 mb-2">请将您上传的图片重命名为 <strong>donation-qr.png</strong> 并放入项目的 <strong>public</strong> 文件夹中。</p>
                 <p className="text-xs text-gray-500">Please rename your uploaded image to <strong>donation-qr.png</strong> and place it in the <strong>public</strong> folder.</p>
               </div>
            </div>
          </div>
        </WindowComponent>
      )}

      {isWindowOpen('pixelator') && (
        <WindowComponent
          id="pixelator"
          title="SHITTY PIXELATOR (像素转换器)"
          onClose={() => closeWindow('pixelator')}
          onFocus={() => focusWindow('pixelator')}
          zIndex={getWindowZIndex('pixelator')}
          defaultPos={{ x: 200, y: 150 }}
          defaultSize={{ width: 450, height: 500 }}
        >
          <div className="bg-[#c0c0c0] h-full flex flex-col p-2 border-[2px] border-gray-500 overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <button 
                className="px-2 py-1 bg-gray-200 border-2 border-white border-b-gray-800 border-r-gray-800 active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white text-xs font-bold"
                onClick={() => { playSound('click'); document.getElementById('pixel-upload')?.click(); }}
              >
                📁 Load Image (上传)
              </button>
              <input type="file" id="pixel-upload" accept="image/*" className="hidden" onChange={handlePixelUpload} />
              
              <button 
                className="px-2 py-1 bg-gray-200 border-2 border-white border-b-gray-800 border-r-gray-800 active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white text-xs font-bold"
                onClick={() => { playSound('click'); downloadPixelImage(); }}
                disabled={!pixelImage}
              >
                💾 Save (保存)
              </button>
            </div>
            
            <div className="mb-2 flex items-center gap-2">
              <label className="text-xs font-bold whitespace-nowrap">Shittiness / 像素化程度:</label>
              <input 
                type="range" 
                min="1" 
                max="32" 
                value={pixelSize} 
                onChange={(e) => setPixelSize(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs w-6 text-right">{pixelSize}</span>
            </div>

            <div className="flex-1 bg-white border-2 border-gray-800 border-t-gray-400 border-l-gray-400 flex items-center justify-center overflow-hidden relative">
              {!pixelImage && (
                <div className="text-gray-400 text-xs text-center p-4">
                  No image loaded.<br/>Please load an image to pixelate.
                </div>
              )}
              <canvas 
                ref={pixelCanvasRef} 
                className={`max-w-full max-h-full object-contain ${!pixelImage ? 'hidden' : ''}`}
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>
        </WindowComponent>
      )}

      {isWindowOpen('error') && (
        <WindowComponent
          id="error"
          title="Fatal Error"
          onClose={() => closeWindow('error')}
          onFocus={() => focusWindow('error')}
          zIndex={getWindowZIndex('error')}
          defaultPos={{ x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 100 }}
          defaultSize={{ width: 300, height: 150 }}
        >
          <div className="flex items-start gap-4 p-4">
            <AlertTriangle size={32} className="text-red-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="mb-2 font-bold">权限不足。此档案可能导致你的大脑过载。</p>
              <p>Insufficient permissions. This file may overload your brain.</p>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button className="w-24" onClick={() => closeWindow('error')}>OK / 确定</button>
          </div>
        </WindowComponent>
      )}

      {isWindowOpen('pines_town') && (
        <WindowComponent
          id="pines_town"
          title="PINEWOOD.EXE"
          onClose={() => closeWindow('pines_town')}
          onFocus={() => focusWindow('pines_town')}
          zIndex={getWindowZIndex('pines_town')}
          defaultPos={{ x: window.innerWidth / 2 - 250, y: window.innerHeight / 2 - 200 }}
          defaultSize={{ width: 500, height: 400 }}
        >
          <div className="bg-black w-full h-full flex flex-col items-center justify-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/horror/800/600')] bg-cover opacity-50 mix-blend-overlay"></div>
            <h1 className="text-4xl font-serif tracking-widest text-red-600 z-10 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">松木镇怪谈</h1>
            <h2 className="text-xl font-serif tracking-widest text-red-400 z-10 mt-2">PINES TOWN</h2>
            <p className="mt-8 z-10 text-sm text-gray-300 animate-pulse">{">>>"} 视觉冲击加载中 / VISUAL IMPACT LOADING...</p>
          </div>
        </WindowComponent>
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#c0c0c0] border-t-2 border-white flex items-center px-1 z-[9999]">
        <button 
          className="flex items-center px-2 py-1 font-bold shadow-[inset_1px_1px_0px_#fff,inset_-1px_-1px_0px_#0a0a0a,inset_2px_2px_0px_#dfdfdf,inset_-2px_-2px_0px_#808080] active:shadow-[inset_1px_1px_0px_#0a0a0a,inset_-1px_-1px_0px_#fff,inset_2px_2px_0px_#808080,inset_-2px_-2px_0px_#dfdfdf] active:bg-[#dfdfdf]"
          onClick={() => playSound('click')}
        >
          <span className="mr-1 text-sm">💩</span>
          START / COT
        </button>
        <div className="flex-1 flex px-2 gap-1 overflow-x-auto">
          {windows.filter(w => w.isOpen).map(w => (
            <button 
              key={w.id} 
              className={`px-2 py-1 text-xs truncate max-w-[150px] ${w.isFocused ? 'shadow-[inset_1px_1px_0px_#0a0a0a,inset_-1px_-1px_0px_#fff,inset_2px_2px_0px_#808080,inset_-2px_-2px_0px_#dfdfdf] bg-[#dfdfdf] font-bold' : 'shadow-[inset_1px_1px_0px_#fff,inset_-1px_-1px_0px_#0a0a0a,inset_2px_2px_0px_#dfdfdf,inset_-2px_-2px_0px_#808080]'}`}
              onClick={() => { playSound('click'); focusWindow(w.id); }}
            >
              {w.title}
            </button>
          ))}
        </div>
        <div className="px-2 py-1 shadow-[inset_1px_1px_0px_#808080,inset_-1px_-1px_0px_#fff] text-xs font-mono ml-1">
          {time}
        </div>
      </div>
    </div>
  );
}

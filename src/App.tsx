import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Book as BookIcon, Info, Scale, Type } from 'lucide-react';

// Constants for book dimensions (1 unit = 10cm)
const BOOK_WIDTH = 1.5;
const BOOK_HEIGHT = 2.2;
const PAGE_THICKNESS = 0.001; // 0.1mm per page
const LINES_PER_PAGE = 35;

interface BookProps {
  lineCount: number;
  color?: string;
  title?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const Book: React.FC<BookProps> = ({ lineCount, color = "#4a5568", title = "Your Book", position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  const pageCount = Math.ceil(lineCount / LINES_PER_PAGE);
  const thickness = Math.max(0.05, pageCount * PAGE_THICKNESS);
  
  return (
    <group position={position} rotation={rotation}>
      {/* Back Cover */}
      <mesh position={[BOOK_WIDTH / 2, 0, -thickness / 2]}>
        <boxGeometry args={[BOOK_WIDTH, BOOK_HEIGHT, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Spine */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[thickness, BOOK_HEIGHT, 0.05]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Pages Block (Static) */}
      <mesh position={[BOOK_WIDTH / 2, 0, 0]}>
        <boxGeometry args={[BOOK_WIDTH - 0.05, BOOK_HEIGHT - 0.1, thickness - 0.02]} />
        <meshStandardMaterial color="#f7fafc" />
      </mesh>

      {/* Front Cover */}
      <group position={[0, 0, thickness / 2]}>
        <mesh position={[BOOK_WIDTH / 2, 0, 0.025]}>
          <boxGeometry args={[BOOK_WIDTH, BOOK_HEIGHT, 0.05]} />
          <meshStandardMaterial color={color} />
          <Text
            position={[0, 0.5, 0.03]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.2}
          >
            {title}
          </Text>
          <Text
            position={[0, -0.5, 0.03]}
            fontSize={0.1}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {lineCount.toLocaleString()} Lines
          </Text>
        </mesh>
      </group>
    </group>
  );
};

const ReferenceObject = () => (
  <group position={[0, -1.15, 0]}>
    {/* Table/Surface */}
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#e2e8f0" />
    </mesh>
    
    {/* Ruler/Scale indicator */}
    <group position={[0, 0.01, 3]}>
      {[...Array(11)].map((_, i) => (
        <group key={i} position={[i - 5, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.02, 0.02, 0.2]} />
            <meshStandardMaterial color="#718096" />
          </mesh>
          <Text position={[0, 0.05, 0.2]} fontSize={0.15} color="#4a5568" rotation={[-Math.PI / 2, 0, 0]}>
            {i * 10}cm
          </Text>
        </group>
      ))}
    </group>
  </group>
);

export default function App() {
  const [lineCount, setLineCount] = useState<number>(() => {
    const params = new URLSearchParams(window.location.search);
    return Math.max(1, parseInt(params.get('lines') || '1000'));
  });
  const [bookTitle, setBookTitle] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('title') || 'My Custom Book';
  });
  const [showReference, setShowReference] = useState(true);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('lines', lineCount.toString());
    url.searchParams.set('title', bookTitle);
    window.history.replaceState({}, '', url.toString());
  }, [lineCount, bookTitle]);

  const warAndPeaceLines = 42000; // Approx lines for 1200 pages
  const hobbitLines = 9500; // Approx lines for 300 pages

  return (
    <div className="relative w-full h-screen bg-slate-50 font-sans overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full z-10 p-6 flex flex-col md:flex-row justify-between items-start gap-6 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-200 pointer-events-auto max-w-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookIcon className="text-indigo-600" size={24} />
            <h1 className="text-xl font-bold text-slate-800">Book Scale Visualizer</h1>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-1">
                <Type size={14} />
                Book Title
              </label>
              <input 
                type="text" 
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="Enter book title..."
                className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Number of Lines</label>
              <input 
                type="number" 
                value={lineCount}
                onChange={(e) => setLineCount(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <input 
                type="range" 
                min="100" 
                max="200000" 
                step="100"
                value={lineCount}
                onChange={(e) => setLineCount(parseInt(e.target.value))}
                className="w-full mt-2 accent-indigo-600"
              />
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowReference(!showReference)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all shadow-lg ${
                  showReference ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Scale size={18} />
                {showReference ? 'Hide References' : 'Show References'}
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Estimated Pages:</span>
                <span className="font-mono">{Math.ceil(lineCount / LINES_PER_PAGE).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Physical Thickness:</span>
                <span className="font-mono">{(Math.ceil(lineCount / LINES_PER_PAGE) * 0.1).toFixed(1)} mm</span>
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showReference && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-auto text-sm"
            >
              <div className="flex items-center gap-2 text-slate-700 font-semibold mb-2">
                <Info size={16} />
                <span>Scale References</span>
              </div>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-700" />
                  <span>War and Peace (~42k lines)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-700" />
                  <span>The Hobbit (~9.5k lines)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-600" />
                  <span>Your Custom Book</span>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3D Scene */}
      <div className="w-full h-full bg-slate-100">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[5, 5, 8]} fov={40} />
          <OrbitControls 
            enableDamping 
            minDistance={3} 
            maxDistance={20} 
            maxPolarAngle={Math.PI / 2}
            target={[0, 0, 0]}
          />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Environment preset="city" />

          <group position={[0, 0, 0]}>
            {/* User's Book */}
            <Book 
              lineCount={lineCount} 
              color="#4f46e5" 
              title={bookTitle}
              position={[0, 0, 0]}
            />

            {/* Reference Books */}
            {showReference && (
              <>
                <Book 
                  lineCount={warAndPeaceLines} 
                  color="#92400e" 
                  title="War and Peace"
                  position={[-3, 0, 0]}
                  rotation={[0, 0.1, 0]}
                />
                <Book 
                  lineCount={hobbitLines} 
                  color="#065f46" 
                  title="The Hobbit"
                  position={[3, 0, 0]}
                  rotation={[0, -0.1, 0]}
                />
              </>
            )}
          </group>

          <ReferenceObject />
          <ContactShadows position={[0, -1.15, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        </Canvas>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-400 text-xs text-center pointer-events-none">
        <p>Drag to rotate • Scroll to zoom • 1 unit = 10cm</p>
      </div>
    </div>
  );
}

// src/App.jsx
import React from 'react';
import KorotusGame from './components/KorotusGame';
import { Toaster } from "./components/ui/toaster";
import { Github } from 'lucide-react';

function App() {
  return (
    <>
      {/* Main content */}
      <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800">
        {/* GitHub link */}
        <a
          href="https://github.com/yourusername/korotus-game"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed top-4 left-4 z-50 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <Github className="w-6 h-6" />
        </a>

        {/* Game title */}
        <div className="text-center pt-8 pb-4">
          <h1 className="text-4xl font-bold text-white mb-2">Korotus</h1>
          <p className="text-white/80">Korotus Peli</p>
        </div>

        {/* Game container */}
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <KorotusGame />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-4 text-white/60 text-sm">
          <p>Made with ❤️ by Teemu  </p>
        </footer>
      </div>

      {/* Toast notifications */}
      <Toaster />
    </>
  );
}

export default App;
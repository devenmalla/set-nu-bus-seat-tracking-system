
import React from 'react';
import { Bus, GraduationCap, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
              <Bus className="w-10 h-10 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2 flex items-center gap-2">
                SET-NU Bus Service
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </h1>
              <p className="text-blue-100 text-lg font-medium">
                School of Engineering and Technology, Nagaland University
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

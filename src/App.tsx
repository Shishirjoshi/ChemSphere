/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Main application component for ChemSphere
 * Manages routing between different pages and handles user authentication
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/home/LandingPage';
import { BondSimulator } from './components/simulator/BondSimulator';
import { MoleculeShapeVisualizer } from './components/simulator/MoleculeShapeVisualizer';
import { Dashboard } from './components/dashboard/Dashboard';
import { QuizPage } from './components/quiz/QuizPage';
import { TopicDetails } from './components/home/TopicDetails';
import { Footer } from './components/layout/Footer';
import { ParticleBackground } from './components/common/ParticleBackground';
import { AIChat } from './components/common/AIChat';
import { CustomCursor } from './components/common/CustomCursor';
import { Topic } from './types';

/**
 * Available page routes in the application
 * @typedef {('home' | 'simulator' | 'molecular-shape' | 'dashboard' | 'quiz' | 'topic')} Page
 */
export type Page = 'home' | 'simulator' | 'molecular-shape' | 'dashboard' | 'quiz' | 'topic';

/**
 * Main App component
 * @component
 * @returns {React.ReactNode} The rendered application with routing and layout
 */
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  /**
   * Navigate to a specific page with optional topic selection
   * @param {Page} page - The page to navigate to
   * @param {Topic} [topic] - Optional topic to display
   */
  const navigateTo = (page: Page, topic?: Topic) => {
    setCurrentPage(page);
    if (topic) setSelectedTopic(topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Render the appropriate page component based on current route
   * @returns {React.ReactNode} The page component to render
   */
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <LandingPage onNavigate={navigateTo} />;
      case 'simulator':
        return <BondSimulator />;
      case 'molecular-shape':
        return <MoleculeShapeVisualizer />;
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'quiz':
        return <QuizPage />;
      case 'topic':
        return selectedTopic ? <TopicDetails topic={selectedTopic} onBack={() => setCurrentPage('home')} onNavigate={navigateTo} /> : <LandingPage onNavigate={navigateTo} />;
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#050B18] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
        <CustomCursor />
        <ParticleBackground />
        <Navbar onNavigate={navigateTo} currentPage={currentPage} />
        <main className="relative z-10 pt-20">
          {renderPage()}
        </main>
        <Footer onNavigate={navigateTo} />
        <AIChat />
      </div>
    </AuthProvider>
  );
}

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#050B18] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
        <CustomCursor />
        <ParticleBackground />
        <Navbar onNavigate={navigateTo} currentPage={currentPage} />
        <main className="relative z-10 pt-20">
          {renderPage()}
        </main>
        <Footer onNavigate={navigateTo} />
        <AIChat />
      </div>
    </AuthProvider>
  );
}

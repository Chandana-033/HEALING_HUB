import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BotanicalBackground from './BotanicalBackground';
import SafetyModal from './SafetyModal';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => (
  <div className="min-h-screen flex flex-col">
    <BotanicalBackground />
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <SafetyModal />
  </div>
);

export default PageLayout;

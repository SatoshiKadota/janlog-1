import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { type Tab } from './components/layout/Navbar';
import { ScoreInput } from './components/features/ScoreInput';
import { History } from './components/features/History';
import { Settings } from './components/features/Settings';
import { PlayerList } from './components/features/PlayerList';

function App() {
  const [currentTab, setCurrentTab] = useState<Tab>('input');

  const renderContent = () => {
    switch (currentTab) {
      case 'input':
        return <ScoreInput />;
      case 'history':
        return <History />;
      case 'players':
        return <PlayerList />;
      case 'settings':
        return <Settings />;
      default:
        return <ScoreInput />;
    }
  };

  return (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;

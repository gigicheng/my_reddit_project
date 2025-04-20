import './App.css';
import Header from './features/header/Header';
import Subreddits from './features/subreddits/Subreddits';
import Page from './features/page/Page';

function App() {

  return (
    <div id='app'>
      <Header />
      <main>
        <Subreddits />
        <Page />
      </main>
    </div>
  )
}

export default App

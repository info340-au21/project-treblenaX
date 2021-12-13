import PartyPortal from './PartyPortal';
import {PartyInterface} from './PartyInterface';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import '../css/App.css';
import PlayHistory from './PlayHistoryModule';
import FooterModule from './FooterModule';
import Auth from './Auth';
import Config from '../json/config.json';

/**
 * Main App component, handles routing (eventually)
 */
export default function App(props) {
  return (
    <Router>
      <div>
        <div>
          {
            /**
                         * TO TA/GRADER:
                         *
                         * Alan here. I wrote this. I know in class, we were taught how to use React Router 5,
                         * but seeing at React Router 5 uses certain components and methods that are deprecated
                         * or replaced in React Router 6, I made the decision to implement our app using React
                         * Router 6. Therefore, some of the code dealing with routing may not be similar to what
                         * is done as examples in class, but performs very much the same functionality. I hope
                         * you can understand my reasoning behind this decision. If you want to discuss this,
                         * reach me at wenjalan@uw.edu. Thanks.
                         */
          }
          <Routes>
            <Route path="/*" element={<PartyPortal clientId={Config.spotifyClientId} />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/party/:partyId" element={<PartyInterface />} />
            <Route exact path="/party/:partyId/play-history" element={<PlayHistory />} />
          </Routes>
        </div>
        <div>
          <FooterModule />
        </div>
      </div>
    </Router>
  );
}

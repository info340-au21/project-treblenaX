import PartyPortal from './PartyPortal';
import { PartyInterface } from './PartyInterface';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
                    <Routes>
                        <Route path="/" element={<PartyPortal clientId={Config.spotifyClientId} />} />
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
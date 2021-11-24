import PartyPortal from './PartyPortal';
import { PartyInterface, getQueue } from './PartyInterface';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import '../css/App.css';
import PlayHistory from './PlayHistoryModule';

/**
 * Main App component, handles routing (eventually)
 */
export default function App(props) {
    return (
        <Router>
            <nav id="debug-nav">
                <h1>Debug App Navigation</h1>
                <ul>
                    <li><Link to="/">Party Portal</Link></li>
                    <li><Link to="/party/abcde">Party Interface</Link></li>
                    <li><Link to="/party/abcde/play-history">Play History</Link></li>
                    <button onClick={(e) => {
                        // delete the navbar
                        const navbar = document.getElementById('debug-nav');
                        navbar.parentNode.removeChild(navbar);
                    }}>Hide</button>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<PartyPortal />} />
                <Route path="/party/:partyId" element={<PartyInterface />} />
                <Route exact path="/party/:partyId/play-history" element={<PlayHistory getQueue={ getQueue } />} />
            </Routes>
            <footer>Created by Elbert Change, Ryan Langford, Stephan Rubalcava, Alan Wen</footer>
        </Router>
    );
}
import PartyPortal from './PartyPortal';
import PartyInterface from './PartyInterface';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

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
            </Routes>
        </Router>
    );
}
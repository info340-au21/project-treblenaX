import React, { useEffect, useState } from 'react';
import { SongCard } from './SearchModule';
import { Link, useLocation } from 'react-router-dom';
import { getHistoryData } from './FirebaseHandler';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function PlayHistory(props) {
    // get state from url query params
    const [history, setHistory] = useState([]);
    const location = useLocation();
    const partyId = location.state.partyId;
    const username = location.state.username;
    const accessToken = location.state.accessToken;
    const songHistory = props.queue;

    // update state when song history changes
    useEffect(() => {
        getHistoryData(setHistory, partyId);
    }, []);

    // print out retrieved history data
    console.log("current history:", history);
    
    return (
        <div>
            <Link to={"/party/" + partyId} state={{partyId: partyId, username: username, accessToken: accessToken}}>
                <button className="back-history-button" src=""> <FontAwesomeIcon icon={faArrowLeft} /> Back</button>
            </Link>
            <h1 className="history-title">Queue History</h1>
            <div className="column-container results-column song-list flex-item-songs-container">
                { createHistoryCards(history) }
            </div>
        </div>
    );
}

/* Private helper functions */
function createHistoryCards(data) {
    
    // create song cards for each song in history
    let songs = [];
    for (const song in data) {
        data[song].id = song;

        songs.push(data[song]);
    }
    let result = songs.map(i => {
        return <SongCard key={i.id} payload={i}/>;
    });
    return result;
}


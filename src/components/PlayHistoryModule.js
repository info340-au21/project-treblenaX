import React, { useEffect, useState } from 'react';
import { SongCard } from './SearchModule';
import { Link, useLocation } from 'react-router-dom';
import { getHistoryData } from './FirebaseHandler';

export default function PlayHistory(props) {
    // get state from url query params
    const [history, setHistory] = useState([]);
    const location = useLocation();
    const partyId = location.state.partyId;
    const username = location.state.username;
    const songHistory = props.queue;

    // update state when song history changes
    useEffect(() => {
        getHistoryData(setHistory, partyId);
    }, []);

    console.log(history);
    
    return (
        <div>
            <Link to={"/party/" + partyId} state={{partyId: partyId, username: username}}>
                <button className="play-history-button" src="">History</button>
            </Link>
            <h1>Play History</h1>
            {/* <div className="column-container results-column song-list flex-item-songs-container">
                { createHistoryCards(undefined) }
            </div> */}
        </div>
    );
}

/* Private helper functions */
function createHistoryCards(data) {
    console.log("Creating history cards from data:", data);
    return data.map((song) => (<SongCard key={ song.id } payload={ song }/>));
}


import React, { useEffect } from 'react';
import { SongCard } from './SearchModule';
import { Link, useLocation } from 'react-router-dom';
import { history } from './PartyInterface';

export default function PlayHistory(props) {
    // get state from url query params
    const location = useLocation();
    const partyId = location.state.partyId;
    const username = location.state.username;
    const songHistory = props.getQueue();

    // update state when song history changes
    useEffect(() => {
        
    });
    
    return (
        <div>

            <Link to={"/party/" + partyId} state={{partyId: partyId, username: username}}>
                <button className="play-history-button" src="">History</button>
            </Link>
            <h1>Play History</h1>
            <div className="column-container results-column song-list flex-item-songs-container">
                { createHistoryCards(history) }
            </div>
        </div>
    );
}

/* Private helper functions */
function createHistoryCards(data) {
    console.log("Creating history cards from data:", data);
    return data.map((song) => (<SongCard key={ song.id } payload={ song }/>));
}


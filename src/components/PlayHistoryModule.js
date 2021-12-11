import React from 'react';
import { SongCard } from './SearchModule';
import { Link, useLocation } from 'react-router-dom';

export default function PlayHistory(props) {
    // get state from url query params
    const location = useLocation();
    const partyId = location.state;
    const songHistory = props.getQueue();

    console.log(location);
    return (
        <div>

            <Link to={"/party/" + partyId}>
                <button className="play-history-button" src="">History</button>
            </Link>
            <h1>Play History</h1>
            <div className="column-container results-column">
                { createHistoryCards(songHistory) }
            </div>
        </div>
    );
}

/* Private helper functions */
function createHistoryCards(data) {
    return data.map((song) => (<SongCard key={ song.id } payload={ song }/>));
}


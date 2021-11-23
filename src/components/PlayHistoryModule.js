import React from 'react';
import { SongCard } from './SearchModule';

export default function PlayHistory(props) {
    const songHistory = props.getQueue();


    return (
        <div>
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


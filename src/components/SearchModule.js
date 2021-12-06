import React from 'react';
import QueueIcon from '@mui/icons-material/Queue';

export default function SearchModule(props) {
    let payload = props.songData;
    return (
        <div className="column-container results-column">
            <SearchBar />
            <ResultsList payload={ payload } handleAdd={props.addCallBack} />
        </div>
    );
}

export function SongCard(props) {
    const data = props.payload;

    return (
        <div className="flex-item-song-card">
            <img className="song-card-image-box" src={ data.img } />
            <div className="song-card-image-desc">
                <h1>{ data.name }</h1>
                <h2>{ data.artists }</h2>
            </div>
            <div className="song-card-image-end-bar">
                <div className="song-card-image-end-bar-icon" onClick={() => props.handleAdd(data)}>
                    <span className="add-queue-icon material-icons">
                        <QueueIcon />
                    </span>
                </div>
                <h2>{ data.duration }</h2>
            </div> 
        </div>
    );
}

/* Private Components */
function SearchBar() {
    return (
        <form>
            <input type="text" id="search-query" name="search-query" placeholder="Search for a song" />
            <label for="search-query" className="hidden">song search</label>
        </form>
    );
}

function ResultsList(props) {
    const data = props.payload;

    // @TODO: temporary pagination
    const limit = 15;

    let i = 0;

    const cards = data.map((song) => {
        if (i++ < limit) {
            return (<SongCard key={ song.id } payload={ song } handleAdd={props.handleAdd} />);
        } else {
            return;
        }
    });

    return (
        <div className="flex-item-songs-container">
            { cards }
        </div>
    );
}
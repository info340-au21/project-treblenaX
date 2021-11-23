import React from 'react';

export default function SearchModule(props) {
    let payload = props.songData;

    return (
        <div className="column-container results-column">
            <SearchBar />
            <ResultsList payload={ payload } />
        </div>
    );
}

// Components
function SearchBar() {
    return (
        <form>
            <input type="text" id="search-query" name="search-query" placeholder="Search for a song" />
        </form>
    );
}

function ResultsList(props) {
    const data = extractPayload(props.payload);

    // @TODO: temporary pagination
    const limit = 15;

    let i = 0;

    const cards = data.map((song) => {
        if (i++ < limit) {
            return (<SongCard key={ song.id } payload={ song } />);
        } else {
            return;
        }
    });

    console.log(data[0]);

    return (
        <div className="flex-item-songs-container">
            { cards }
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
                <div className="song-card-image-end-bar-icon">
                    <span className="add-queue-icon material-icons">
                        done
                    </span>
                </div>
                <h2>{ data.duration }</h2>
            </div> 
        </div>
    );
}

/* Private Function Helpers */
function extractPayload(payload) {
    return payload.tracks.items.map((item) => {
        const artists = item.artists.map((artist) => artist.name).join(', ')
        return {
            id: item.id,
            name: item.name,
            artists: artists,
            img: item.album.images[0].url,
            duration: msToTime(item.duration_ms)
        };
    })
}

function msToTime(ms) {
    const minutes = Math.round((ms / 1000) / 60);
    const seconds = Math.round((ms / 1000) % 60);

    if (seconds > 10) {

    }

    return (seconds < 10) ? minutes + ":0" + seconds : minutes + ":" + seconds;
}
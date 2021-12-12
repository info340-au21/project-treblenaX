import React from 'react';
import QueueIcon from '@mui/icons-material/Queue';
import SpotifyWebApi from 'spotify-web-api-js';
import Config from '../json/config.json';
import $ from 'jquery';

const TEST_TOKEN = Config.testToken;
const spotifySearchEndpoint = 'https://api.spotify.com/v1/search';

export default function SearchModule(props) {
    // isSearching
    const [isSearching, setIsSearching] = React.useState(false);

    let payload = props.searchResults;
    let host = props.host;
    return (
        <div className="column-container results-column">
            <SearchBar setIsSearching={setIsSearching} host={host} resultCallback={props.searchCallback}/>
            <ResultsList isSearching={isSearching} payload={ payload } handleAdd={props.addCallBack} />
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
function SearchBar(props) {
    // Spotify API: authenticate using host's access token
    const spotify = new SpotifyWebApi();
    if (props.host) {
        spotify.setAccessToken(props.host.accessToken);
    }

    // Search Handler
    const handleSearch = (e) => {
        // set isSearching to true
        props.setIsSearching(true);
        const query = e.target.value;

        // dont do anything if the query is empty
        if (query.length === 0) {
            return;
        }
        spotify.searchTracks(query)
        .then(data => props.resultCallback(data))
        .catch(error => console.error(error))
        .finally(() => props.setIsSearching(false));
    }

    return (
        <form>
            <input onKeyUp={handleSearch} type="text" id="search-query" name="search-query" placeholder="Search for a song" />
            <label for="search-query" className="hidden">Search a song</label>
        </form>
    );
}

function ResultsList(props) {
    // TODO: turn this into a real searching icon or something
    if (props.isSearching) {
        return (
            <h1>Searching...</h1>
        );
    }
    const data = props.payload ? props.payload : [];

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
        <div className="song-list flex-item-songs-container">
            { cards }
        </div>
    );
}
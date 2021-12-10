import React from 'react';
import QueueIcon from '@mui/icons-material/Queue';
import SpotifyWebApi from 'spotify-web-api-js';
import Config from '../json/config.json';
import $ from 'jquery';

const TEST_TOKEN = Config.testToken;
const spotifySearchEndpoint = 'https://api.spotify.com/v1/search';

export default function SearchModule(props) {
    let payload = props.searchResults;
    let host = props.host;
    console.log('Host:', host);
    return (
        <div className="column-container results-column">
            <SearchBar host={host} resultCallback={props.searchCallback}/>
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
function SearchBar(props) {
    // Spotify API: authenticate using host's access token
    // TODO: Replace this with the actual host's user token
    const spotify = new SpotifyWebApi();
    // spotify.setAccessToken(props.host.accessToken);
    spotify.setAccessToken(TEST_TOKEN);

    // Search Handler
    const handleSearch = (e) => {
        console.log(`Search Query: ${e.target.value}`);
        const query = e.target.value;

        // dont do anything if the query is empty
        if (query.length === 0) {
            return;
        }
        spotify.searchTracks(query)
        .then(data => {
            props.resultCallback(data);
        })
        .catch(error => console.error(error));
    }

    return (
        <form>
            <input onKeyUp={handleSearch} type="text" id="search-query" name="search-query" placeholder="Search for a song" />
            <label for="search-query" className="hidden">song search</label>
        </form>
    );
}

function ResultsList(props) {
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
        <div className="flex-item-songs-container">
            { cards }
        </div>
    );
}
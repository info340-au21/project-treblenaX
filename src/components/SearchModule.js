import React from 'react';
import QueueIcon from '@mui/icons-material/Queue';
import SpotifyWebApi from 'spotify-web-api-js';
import Config from '../json/config.json';
import InstructionModule from './InstructionModule';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

const TEST_TOKEN = Config.testToken;
const spotifySearchEndpoint = 'https://api.spotify.com/v1/search';

export default function SearchModule(props) {
  // isSearching
  const [isSearching, setIsSearching] = React.useState(false);
  // isDisplayed for the instruction module
  const [isDisplayed, setIsDisplayed] = React.useState(true);

  const payload = props.searchResults;
  const host = props.host;

  return (
    <div className="column-container results-column">
      <SearchBar setIsDisplayed={setIsDisplayed} setIsSearching={setIsSearching} host={host} resultCallback={props.searchCallback}/>
      <InstructionModule isPortal={false} isDisplayed={isDisplayed}/>
      <ResultsList isDisplayed={isDisplayed} isSearching={isSearching} payload={ payload } handleAdd={props.addCallBack} />
    </div>
  );
}

export function SongCard(props) {
  const data = props.payload;

  if (!data) { // Place empty song card to make space
    return (
      <div className="flex-item-song-card"></div>
    );
  } else {
    return (
      <div className="flex-item-song-card">
        <img className="song-card-image-box" src={ data.img } alt='album cover' />
        <div className="song-card-image-desc">
          <h1>{ data.name }</h1>
          <h2>{ data.artists }</h2>
        </div>
        <div className="song-card-image-end-bar">
          <div className="song-card-image-end-bar-icon" onClick={() => props.handleAdd(data)}>
            <span className="add-queue-icon material-icons" aria-label="add song to queue">
              <QueueIcon />
            </span>
          </div>
          <h2>{ data.duration }</h2>
        </div>
      </div>
    );
  }
}

/* Private Components */
function SearchBar(props) {
  const setIsDisplayed = props.setIsDisplayed;
  // Spotify API: authenticate using host's access token
  const spotify = new SpotifyWebApi();
  if (props.host) {
    spotify.setAccessToken(props.host.accessToken);
  }

  // Search Handler
  const handleSearch = (e) => {
    e.preventDefault();
    // set isSearching to true
    props.setIsSearching(true);
    const query = e.target.value;

    // dont do anything if the query is empty
    if (query.length === 0) {
      setIsDisplayed(true);
      props.setIsSearching(false);
      return;
    } else {
      setIsDisplayed(false);
    }
    spotify.searchTracks(query)
        .then((data) => props.resultCallback(data))
        .catch((error) => console.error(error))
        .finally(() => props.setIsSearching(false));
  };

  // stop the user from pressing enter
  const preventEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <form>
      <input onKeyPressCapture={preventEnter} onKeyUpCapture={handleSearch} type="text" id="search-query" name="search-query" placeholder="Search for a song" />
      <label htmlFor="search-query" className="hidden">Search a song</label>
    </form>
  );
}

function ResultsList(props) {
  const isDisplayed = props.isDisplayed;
  // TODO: turn this into a real searching icon or something
  if (props.isSearching) {
    return (
      <div className="loading-page">
        <FontAwesomeIcon icon={faSpinner} className="loading-icon fa-spin" />
      </div>
    );
  }
  const data = props.payload ? props.payload : [];

  // @TODO: temporary pagination
  const limit = 15;

  let i = 0;


  let cards;
  if (!isDisplayed) {
    cards = data.map((song) => {
      if (i++ < limit) {
        return (<SongCard key={ song.id } payload={ song } handleAdd={props.handleAdd} />);
      } else {
        return;
      }
    });
    cards[cards.length] = (<SongCard key="empty" payload={undefined} />);
  } else {
    cards = [];
  }

  return (
    <div className="song-list flex-item-songs-container">
      { cards }
    </div>
  );
}

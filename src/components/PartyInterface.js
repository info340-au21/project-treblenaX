import React, {useState, useEffect} from 'react';
import SearchModule from './SearchModule.js';
import QueueList from './QueueModule.js';
import UserInformation from './UserInformation.js';
import '../css/PartyPortal.css';
import SpotifyWebApi from 'spotify-web-api-js';
import {useLocation, Navigate} from 'react-router';
import {getPartyQueue, getPartyUsersAndSetHost, postAddQueue, postAddHistory, getPartyUserByUsername, deleteSongById} from './FirebaseHandler.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStroopwafel} from '@fortawesome/free-solid-svg-icons';

export const history = [];

/**
 * Main component of the Party Interface page
 */
export function PartyInterface(props) {
  // get state from url query params
  // if no party id was found, navigate to home
  const location = useLocation();
  let partyId;
  let username;
  let accessToken;
  if (!location.state) {
    partyId = undefined;
    username = undefined;
    accessToken = undefined;
  } else {
    partyId = location.state.partyId;
    username = location.state.username;
    accessToken = location.state.accessToken;
  }

  // User states
  const [user, setUser] = useState(undefined);
  const [partyHost, setPartyHost] = useState(undefined);
  const [users, setUsers] = useState(undefined);

  // Song states
  const [queue, setQueue] = useState(undefined);
  const [searchResults, setSearchResults] = useState([]);
  const [currentSong, setCurrentSong] = useState(undefined);

  // Load state
  const [isUserLoaded, setUserLoaded] = useState(false);
  const [isUsersLoaded, setUsersLoaded] = useState(false);
  const [isQueueLoaded, setQueueLoaded] = useState(false);
  const [isCurrentSongInitLoaded, setCurrentSongInitLoaded] = useState(false);
  const [isCurrentSongLoading, setCurrentSongLoading] = useState(false);

  // Init Spotify utility
  const webApi = new SpotifyWebApi();
  webApi.setAccessToken(accessToken);

  // useEffect -> when component is loaded
  useEffect(() => {
    // Set current user
    getPartyUserByUsername(setUser, setUserLoaded, partyId, username);
    // Grab party users and set host
    getPartyUsersAndSetHost(setUsers, setUsersLoaded, setPartyHost, partyId);
    // Grab current party queue
    getPartyQueue(setQueue, setQueueLoaded, partyId);

    // Init Current Track
    webApi.getMyCurrentPlayingTrack()
        .then((track) => setCurrentSong(extractCurrentSong(track)));

    const interval = setInterval(() => {
      webApi.getMyCurrentPlayingTrack()
          .then((track) => {
            if (!track) { // If there is NOT a song currently playing
              console.log('No current song is playing.');
            } else { // If there IS a song currently playing
              updateCurrentSong(webApi, partyId, extractCurrentSong, setCurrentSong);
            }
          })
          .then(() => setCurrentSongInitLoaded(true));
    }, 2000);

    // Clear to prevent memory leak
    return () => clearInterval(interval);
  }, []);

  // Handler functions
  const handleSkip = () => {
    setCurrentSongLoading(true);
    // Skips to next song
    webApi.skipToNext();
    // Update the current song
    updateCurrentSong(webApi, partyId, extractCurrentSong, setCurrentSong, setCurrentSongLoading);
  };

  const handleAdd = (song) => {
    // sends queue request
    webApi.queue(song.uri)
        .catch((err) => console.log(err));
    // adds to song to the db queue
    postAddQueue(partyId, song);
    // adds song to db queue history
    postAddHistory(partyId, song);
  };

  const handleSearch = (results) => {
    const songData = extractPayload(results);
    setSearchResults(songData);
  };

  // if no partyid was defined, redirect to home
  if (partyId === undefined) {
    return (
      <Navigate to="/" />
    );
  }

  if (isUserLoaded && isUsersLoaded && isQueueLoaded && isCurrentSongInitLoaded) {
    return (
      <div className="interface-container">
        <UserInformation
          user={user}
          partyId={partyId}
          users={users} />
        <SearchModule
          host={partyHost}
          searchResults={searchResults}
          searchCallback={handleSearch}
          addCallBack={handleAdd} />
        <QueueList
          username={username}
          partyId={partyId}
          accessToken={accessToken}
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          baseSongList={formatQueue(queue)}
          isCurrentSongLoading={isCurrentSongLoading}
          setCurrentSongLoading={setCurrentSongLoading}
          handleSkip={handleSkip}/>
      </div>
    );
  } else {
    return (
      <div className="loading-page">
        <FontAwesomeIcon className="loading-icon fa-spin" icon={faStroopwafel} />
        <div className="loading-text">
          <h1>Blowing up balloons for the party...</h1>
        </div>
      </div>
    );
  }
}

/* Public function helpers */

/* Private function helpers */
function updateCurrentSong(webApi, partyId, extractCurrentSong, setCurrentSong) {
  webApi.getMyCurrentPlayingTrack()
      .then((rawNewSong) => {
        if (rawNewSong !== undefined) { // If a track is currently playing
          const newSong = extractCurrentSong(rawNewSong);

          setCurrentSong((prevSong) => {
            if (prevSong === undefined) return newSong; // If the current track is null
            else { // If the current track has a song
              if (newSong.id !== prevSong.id) { // If the currently playing track is different than queue
                // Delete next song in queue
                deleteSongById(partyId, newSong.id);
                // Update current song
                return newSong;
              }
              return prevSong;
            }
          });
        }
      });
}

function formatQueue(q) {
  const newQ = [];
  let val = 0;
  if (q) {
    for (const i of Object.keys(q)) {
      newQ[val] = {
        id: q[i].id,
        name: q[i].name,
        artist: q[i].artists,
        img: q[i].img,
        album: q[i].album,
        duration: q[i].duration,
      };
      val++;
    }
  }
  return newQ;
}

/*  Converts the Spotify API Get Songs result into our Song model
 *  payload     -       pure Spotify API Get data
 */
function extractPayload(payload) {
  return payload.tracks.items.map((item) => {
    const artists = item.artists.map((artist) => artist.name).join(', ');
    return {
      id: item.id,
      name: item.name,
      artists: artists,
      img: item.album.images[0].url,
      album: item.album.name,
      duration: msToTime(item.duration_ms),
      uri: item.uri,
    };
  });
}

function extractCurrentSong(track) {
  if (track) {
    const item = track.item;
    const artists = item.artists.map((artist) => artist.name).join(', ');
    return {
      id: item.id,
      name: item.name,
      artists: artists,
      img: item.album.images[0].url,
      album: item.album.name,
      duration: msToTime(item.duration_ms),
      uri: item.uri,
    };
  }

  return undefined;
}

/*  Converts milliseconds to MM:SS time string
 *  ms      -       xtmilliseconds
 */
function msToTime(ms) {
  const minutes = Math.round((ms / 1000) / 60);
  const seconds = Math.round((ms / 1000) % 60);

  if (seconds > 10) {

  }

  return (seconds < 10) ? minutes + ':0' + seconds : minutes + ':' + seconds;
}

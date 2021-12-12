import React, { useState, useEffect } from 'react';
import SearchModule from './SearchModule.js';
import QueueList from './QueueModule.js';
import UserInformation from './UserInformation.js';
import '../css/PartyPortal.css';
import SpotifyWebApi from 'spotify-web-api-js';
import { useLocation } from 'react-router';
import { getPartyQueue, getPartyUsers, postAddQueue, getPartyUserByUsername, deleteSongById, deleteSongByRef } from './FirebaseHandler.js';

let queue = [];
export let history = [];


let isKeyLoaded = false;

/**
 * Main component of the Party Interface page
 */
export function PartyInterface(props) {
    // get state from url query params
    const location = useLocation();
    const partyId = location.state.partyId;
    const username = location.state.username;
    const accessToken = location.state.accessToken;

    // User states
    const [user, setUser] = useState();
    const [partyHost, setPartyHost] = useState();
    const [getUsers, setUsers] = useState([]);

    // Song states
    const [getQueue, setQueue] = useState([]);
    const [getHistory, setHistory] = useState([]);
    const [baseSongList, setSongList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    
    // Update state
    const [updateInterval, setUpdateInterval] = useState();

    // Init Spotify utility
    const webApi = new SpotifyWebApi();
    webApi.setAccessToken(accessToken);

    // Handler functions
    const handleSkip = () => {
        //makes sure the host exists to it doesn't crash when trying to get the API key
        if(partyHost != null) {
            let newq = {...getQueue};
            if(Object.keys(newq).length > 1) {
                //Skips to next song
                webApi.skipToNext();
                // Delete song from queue
                deleteSongByRef(partyId, Object.keys(newq)[0]);
                // addsongintohistory
            }
        }
    };

    const handleAdd = (song) => {
        if (partyHost != null) {
            //sends queue request
            webApi.queue(song.uri).then((response) => {
                //Checks if this is the first song being added
                if (getQueue != null) {
                    console.log("Queueing: " + song.name + " " + (Object.keys(getQueue).length + 1));
                } else {
                    console.log("Queueing: " + song.name + " first, timer set");
                    //skips to next so it gets on queue
                    // webApi.skipToNext();
                    //sets timer for length of song
                    //TODO set the timer to half a second after the song ends
                    // setTimer(setTimeout(() => {checkPlaying(webApi, song, partyId, getQueue, setTimer)}, 10000));
                }
            }, (err) => {
                console.log(err);
            });
            //adds song to queue history
            history.push(song);
            console.log("song added to history:", song.name);
            console.log("history:", history);
            //adds to song to the db queue
            postAddQueue(partyId, song);
        } else {
            console.log("failed to add song");
        }
    };

    const handleSearch = (results) => {
        const songData = extractPayload(results);
        setSearchResults(songData);
    }

    // useEffect -> when component is loaded
    useEffect(() => {
        // Set current user
        getPartyUserByUsername(setUser, partyId, username);
        // Acquire all other info
        getPartyUsers(setUsers, setPartyHost, partyId);
        getPartyQueue(setQueue, partyId);

        // Init Current Track
        webApi.getMyCurrentPlayingTrack()
            .then((track) => setCurrentSong(extractCurrentSong(track)));

        const interval = setInterval(() => {
            webApi.getMyCurrentPlayingTrack().then((track) => {
                if (!track) {   // If there is NOT a song currently playing
                    console.log('No current song is playing.');
                } else {    // If there IS a song currently playing
                    updateTrack(webApi, currentSong, partyId, getQueue, extractCurrentSong, setCurrentSong);
                }
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="interface-container">
            {/* <button type="button" name="debug" onClick={  }>click</button> */}
            <UserInformation user={user} partyId={ partyId } getUsers={ getUsers } />
            {/* <div className="flex-item-space"></div> */}
            <SearchModule 
                host={partyHost} 
                searchResults={searchResults} 
                searchCallback={handleSearch} 
                addCallBack={handleAdd} />
            <QueueList 
                username={username} 
                partyId={partyId} 
                currentSong={currentSong}
                setCurrentSong={setCurrentSong}
                baseSongList={formatQueue(getQueue)} 
                handleSkip={handleSkip}/>  
            {/* <CurrentModule currentSong={ currentSong } /> */}
        </div>
    );
}

/* Public function helpers */
export function getQueue() {
    return queue;
}

/* Private function helpers */
function updateTrack(webApi, currentSong, partyId, queue, extractCurrentSong, setCurrentSong) {
    // console.log('update');
    webApi.getMyCurrentPlayingTrack().then((rawNewSong) => {
        // console.log(newSong);
        if (rawNewSong !== undefined) {   // If a track is currently playing
            const newSong = extractCurrentSong(rawNewSong);
            // console.log(currentSong);
            setCurrentSong(prevSong => {
                if (prevSong === null) return newSong;  // If the current track is null
                else {  // If the current track has a song
                    if (newSong.id !== prevSong.id) { // If the currently playing track is different than queue
                        // Delete next song in queue
                        deleteSongById(partyId, newSong.id);
                        console.log('Song is deleted from DB.');
                        // Update current song
                        return newSong;
                    }
                    return prevSong;
                }
            });
        }
    });
}

function checkPlaying(webApi, song, partyId, q, setTimer) {
    //gets the current track info
    webApi.getMyCurrentPlayingTrack().then((track) => {
        //checks if the song that is playing is different from the song in the queue (meant to change songs after the song has completed)
        if(track != undefined && track.item != undefined && track.item.id != song.id) {
            //checks if there is a next song to jump to in the queue
            if(q != undefined && Object.keys(q).length > 1) {
                //sets timer for length of next song
                console.log("timer set");
                //deletes song from queue in db
                deleteSongById(partyId, song);
                //sets new timer for the end of the song that is playing
                setTimer(setTimeout(() => {checkPlaying(webApi, q[Object.keys(q)[1]])}, 10000));
            } 
            //set a new timeout for the length of the next song
        }else {
            //get current timestamp and set timer until end
        }
    }, (err) => {
        console.log(err);
    });
}

function formatQueue(q) {
    let newQ = [];
    let val = 0;
    if (q) {
        for(let i of Object.keys(q)) {
            newQ[val] = {
                id: q[i].id,
                name: q[i].name,
                artist: q[i].artists,
                img: q[i].img,
                album: q[i].album,
                duration: q[i].duration
            }
            val++;
        }
    }
    return newQ;
}

// export function getUsers() {
//     return users;
// } 


/* Private function helpers */

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
            uri: item.uri
        };
    })
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
            uri: item.uri
        }
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

    return (seconds < 10) ? minutes + ":0" + seconds : minutes + ":" + seconds;
}
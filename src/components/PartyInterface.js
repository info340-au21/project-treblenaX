import React, { useState, useEffect } from 'react';
import SearchModule from './SearchModule.js';
import QueueList from './QueueModule.js';
import UserInformation from './UserInformation.js';
import '../css/PartyPortal.css';
import SpotifyWebApi from 'spotify-web-api-js';
import { useLocation } from 'react-router';
import { getPartyQueue, getPartyUsers, postAddQueue, getPartyUserByUsername, deleteSong } from './FirebaseHandler.js';

let queue = [];

/**
 * Main component of the Party Interface page
 */
export function PartyInterface(props) {
    const Spotify = require('spotify-web-api-js');
    const s = Spotify();
    const webApi = new SpotifyWebApi();
    // get state from url query params
    const location = useLocation();
    const partyId = location.state.partyId;
    const username = location.state.username;

    // User states
    const [user, setUser] = useState();
    const [partyHost, setPartyHost] = useState();
    const [getUsers, setUsers] = useState([]);

    // Song states
    const [getQueue, setQueue] = useState([]);
    const [getHistory, setHistory] = useState([]);
    const [baseSongList, setSongList] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    //timer
    const [getTimer, setTimer] = useState(undefined);

    let songData = [];
    // Handler functions
    const handleSkip = () => {
        //makes sure the host exists to it doesn't crash when trying to get the API key
        if(partyHost != null) {
            let newq = {...getQueue};
            if(Object.keys(newq).length > 1) {
                //Sets Api key
                webApi.setAccessToken(partyHost.accessToken);
                //Skips to next song
                webApi.skipToNext();
                //deletes the countdown from the old song
                clearTimeout(getTimer);
                //creates new countdown for new song (10000 is just a placeholder)
                setTimer(setTimeout(() => {checkPlaying(webApi, Object.keys(newq)[1], partyId, getQueue, setTimer)}, 10000));
                deleteSong(partyId, Object.keys(newq)[0]);
                // addsongintohistory
            console.log("song skipped");
            }
        }
    };

    const handleAdd = (song) => {
        if(partyHost != null) {
            webApi.setAccessToken(partyHost.accessToken);
            //sends queue request
                webApi.queue(song.uri).then((response) => {
                    //Checks if this is the first song being added
                    if(getQueue != null) {
                        console.log("Queueing: " + song.name + " " + (Object.keys(getQueue).length + 1));
                    }else {
                        console.log("Queueing: " + song.name + " first, timer set");
                        //skips to next so it gets on queue
                        webApi.skipToNext();
                        //sets timer for length of song
                        //TODO set the timer to half a second after the song ends
                        setTimer(setTimeout(() => {checkPlaying(webApi, song, partyId, getQueue, setTimer)}, 10000));
                    }
                }, (err) => {
                    console.log(err);
                });
                //adds to song to the db queue
                postAddQueue(partyId, song);
        }else {
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
        // getHistoryData(setHistory, roomCode);
        // postAddSession("123456");
    }, []);
    // @TODO: Debug current song - change this for prod
    const currentSong = songData[0];
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
            <QueueList username={username} partyId={ partyId } baseSongList={formatQueue(getQueue)} handleSkip={handleSkip}/>  
            {/* <CurrentModule currentSong={ currentSong } /> */}
        </div>
    );
}

/* Public function helpers */
export function getQueue() {
    return queue;
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
                deleteSong(partyId, song);
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
                // album: q[i].album.name,
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
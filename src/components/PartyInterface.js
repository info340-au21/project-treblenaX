import React, { useState, useEffect } from 'react';
import SearchModule from './SearchModule.js';
import QueueList from './QueueModule.js';
import UserInformation from './UserInformation.js';
import SAMPLE_USERS from '../json/test_users.json';
import CurrentModule from './CurrentModule';
import PlayHistory from './PlayHistoryModule';
import '../css/PartyPortal.css';
import * as songs from '../json/sampleSongs.json';
import SpotifyWebApi from 'spotify-web-api-js';
import Config from '../json/config.json';
// Grab Debug Data
import SONG_DATA from '../json/test_data.json';
import { Routes, Router, Route, useParams, useLocation } from 'react-router';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getSessionData, getPartyQueue, getPartyUsers, getHistoryData, postAddSessionAndHost, postAddUser, postAddQueue, postAddHistory, getPartyUser, getPartyUserByUsername, deleteSong } from './FirebaseHandler.js';
import { getUser, getGlobalUser } from './Auth.js';
import { get } from 'jquery';

const DEBUG = true;
let roomCode;
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
        if(partyHost != null) {
            let newq = {...getQueue};
            if(Object.keys(newq).length > 1) {
                webApi.setAccessToken(partyHost.accessToken);
                webApi.skipToNext();
                //reset the timeout to the new song and stop the old one
                clearTimeout(getTimer);
                setTimer(setTimeout(() => {checkPlaying(webApi, Object.keys(newq)[1], partyId, getQueue, setTimer)}, 10000));
                deleteSong(partyId, Object.keys(newq)[0]);
            console.log("song skipped");
            }
        }
    }
    const handleAdd = (song) => {
        if(partyHost != null) {
            webApi.setAccessToken(partyHost.accessToken);
                webApi.queue(song.uri).then((response) => {
                    if(getQueue != null) {
                        console.log("Queueing: " + song.name + " " + (Object.keys(getQueue).length + 1));
                    }else {
                        console.log("Queueing: " + song.name + " first, timer set");
                        //sets timer for length of song
                        webApi.skipToNext();
                        setTimer(setTimeout(() => {checkPlaying(webApi, song, partyId, getQueue, setTimer)}, 10000));
                    }
                }, (err) => {
                    console.log(err);
                });
                postAddQueue(partyId, song);
        }else {
            console.log("failed to add song");
        }
    }
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
            <QueueList baseSongList={formatQueue(getQueue)} handleSkip={handleSkip}/>  
            {/* <CurrentModule currentSong={ currentSong } /> */}
        </div>
    );
}

/* Public function helpers */
export function getQueue() {
    return queue;
}

function checkPlaying(webApi, song, partyId, q, setTimer) {
    //Get the length of the song and call every interval 
    //gets the current track info
    webApi.getMyCurrentPlayingTrack().then((track) => {
        if(track != undefined && track.item != undefined && track.item.id != song.id) {
            if(q != undefined && Object.keys(q).length > 1) {
                //sets timer for length of next song
                console.log("timer set");
                deleteSong(partyId, song);
                setTimer(setTimeout(() => {checkPlaying(webApi, q[Object.keys(q)[1]])}, 10000));
            }
            //set a new timeout for the length of the next song
        }else {
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
 *  ms      -       milliseconds
 */
function msToTime(ms) {
    const minutes = Math.round((ms / 1000) / 60);
    const seconds = Math.round((ms / 1000) % 60);

    if (seconds > 10) {

    }

    return (seconds < 10) ? minutes + ":0" + seconds : minutes + ":" + seconds;
}
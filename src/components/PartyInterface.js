import React, { useState, useEffect } from 'react';
import SearchModule from './SearchModule.js';
import QueueModule from './QueueModule.js';
import UserInformation from './UserInformation.js';
import SAMPLE_USERS from '../json/test_users.json';
import CurrentModule from './CurrentModule';
import PlayHistory from './PlayHistoryModule';
import '../css/PartyPortal.css';
import * as songs from '../json/sampleSongs.json';

// Grab Debug Data
import SONG_DATA from '../json/test_data.json';
import { Routes, Router, Route, useParams } from 'react-router';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getSessionData, getPartyQueue, getPartyUsers, getHistoryData, postAddSessionAndHost, postAddUser, postAddQueue, postAddHistory } from './FirebaseHandler.js';

const DEBUG = true;
let roomCode;
let queue = [];
let users = [];



/**
 * Main component of the Party Interface page
 */
export function PartyInterface() {
    const urlParams = useParams();
    const [getUsers, setUsers] = useState([]);
    const [getQueue, setQueue] = useState([]);
    const [getHistory, setHistory] = useState([]);

    console.log(urlParams);
    let songData;
    if (DEBUG) {
        songData = extractPayload(SONG_DATA);
        queue = songData;
        roomCode = "000000";
    } else {
        // @TODO: put PROD data collection here
    }

    // useEffect -> when component is loaded
    useEffect(() => {
        // getPartyUsers(setUsers, roomCode);
        // getPartyQueue(setQueue, roomCode);
        // getHistoryData(setHistory, roomCode);
        // postAddSession("123456");
    }, []);

    // @TODO: Debug current song - change this for prod
    const currentSong = songData[0];
    return (
        <div className="interface-container">
            {/* <button type="button" name="debug" onClick={  }>click</button> */}
            <UserInformation roomCode={ urlParams.partyId } getUsers={ getUsers } />
            {/* <div className="flex-item-space"></div> */}
            <SearchModule songData={ songData } />
            <QueueModule songList={ songs }/>  
            <CurrentModule currentSong={ currentSong } />
        </div>
    );
}

/* Public function helpers */
export function getQueue() {
    return queue;
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
import React, { useState, useEffect } from 'react';
import SearchModule from './SearchModule.js';
import QueueList from './QueueModule.js';
import UserInformation from './UserInformation.js';
import SAMPLE_USERS from '../json/test_users.json';
import CurrentModule from './CurrentModule';
import PlayHistory from './PlayHistoryModule';
import '../css/PartyPortal.css';
import * as songs from '../json/sampleSongs.json';

// Grab Debug Data
import SONG_DATA from '../json/test_data.json';
import { Routes, Router, Route, useParams, useLocation } from 'react-router';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getSessionData, getPartyQueue, getPartyUsers, getHistoryData, postAddSessionAndHost, postAddUser, postAddQueue, postAddHistory, getPartyUser, getPartyUserByUsername } from './FirebaseHandler.js';
import { getUser, getGlobalUser } from './Auth.js';

const DEBUG = true;
let roomCode;
let queue = [];

/**
 * Main component of the Party Interface page
 */
export function PartyInterface(props) {
    // get state from url query params
    const location = useLocation();
    const partyId = location.state.partyId;
    const username = location.state.username;

    const [user, setUser] = useState();
    const [getUsers, setUsers] = useState([]);
    const [getQueue, setQueue] = useState([]);
    const [getHistory, setHistory] = useState([]);
    const [baseSongList, setSongList] = useState(songs.default);

    let songData = [];

    // Handler functions
    const handleSkip = (name) => {
        let val = 0;
        let newSongList = [...baseSongList];
        for(let i of baseSongList) {
            if(name == i.name) {
                newSongList.splice(val, 1);
                //TODO Add AWS stuff here
                setSongList(newSongList);
            }
            val++;
        }
    }
    const handleAdd = (song) => {
        let val = 0;
        let newSongList = [...baseSongList]; //TODO add album name
        newSongList[newSongList.length] = song;
        //TODO add AWS stuff here
        setSongList(newSongList);
    }

    // useEffect -> when component is loaded
    useEffect(() => {
        // Set current user
        getPartyUserByUsername(setUser, partyId, username);
        // Acquire all other info
        // getPartyUser(setMainUser, partyId, "alan");
        // getPartyUsers(setUsers, roomCode);
         getPartyQueue(setQueue, partyId);
        // getHistoryData(setHistory, roomCode);
        // postAddSession("123456");
    }, []);
    console.log(getQueue);
    // @TODO: Debug current song - change this for prod
    const currentSong = songData[0];
    return (
        <div className="interface-container">
        <button style={{width: "100px"}} type="button" onClick={() => {
            console.log(user);
        }}></button>
            {/* <button type="button" name="debug" onClick={  }>click</button> */}
            <UserInformation user={user} roomCode={ partyId } getUsers={ getUsers } />
            {/* <div className="flex-item-space"></div> */}
            <SearchModule songData={ songData } addCallBack={handleAdd} />
            <QueueList baseSongList={baseSongList} handleSkip={handleSkip}/>  
            {/* <CurrentModule currentSong={ currentSong } /> */}
        </div>
    );
}

/* Public function helpers */
export function getQueue() {
    return queue;
}

function formatQueue(q) {
    let newQueue = [];
    let val = 0;
    for(let i of q) { //Apperanty not iterable, complete bullshit
        newQueue[val] = {
            id: i.id,
            name: i.name,
            album: i.album.name,
            artists: i.artist,
            img: i.album.img,
            duration: msToTime(i.duration_ms)
        };
        val++;
    }
    return newQueue;
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
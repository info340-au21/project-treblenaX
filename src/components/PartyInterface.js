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

    const [user, setUser] = useState();
    const [getUsers, setUsers] = useState([]);
    const [getQueue, setQueue] = useState([]);
    const [getHistory, setHistory] = useState([]);
    const [baseSongList, setSongList] = useState(undefined);
    const [searchResults, setSearchResults] = useState([]);

    let songData = [];
    webApi.setAccessToken(Config.spotifyClientId);
    // Handler functions
    const handleSkip = () => {
        let newq = {...getQueue};
        if(Object.keys(newq).length > 1) {
            deleteSong(partyId, Object.keys(newq)[0]);
        }
    }
    const handleAdd = (song) => {
        let val = 0;
        let newSongList = [...baseSongList]; //TODO add album name
        newSongList[newSongList.length] = song;
        postAddQueue(partyId, song);
        setSongList(newSongList);
    }
    const handleSearch = (results) => {
        const songData = extractPayload(results);
        console.log(songData);
        setSearchResults(songData);
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
    // if(user.leader) {
    //     leaderActions(webApi);
    // }
    // @TODO: Debug current song - change this for prod
    const currentSong = songData[0];
    return (
        <div className="interface-container">
            {/* <button type="button" name="debug" onClick={  }>click</button> */}
            <UserInformation user={user} partyId={ partyId } getUsers={ getUsers } />
            {/* <div className="flex-item-space"></div> */}
            <SearchModule 
                host={undefined} 
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

function leaderActions(webApi, q) {
    //TODO add a loop here somewhere 
    if(webApi.myCurrentPlayingTrack() != Object.keys(q)[0].uri) {
        webApi.skipToNext();
    }
}

function formatQueue(q) {

    let newQ = [];
    let val = 0;
    if (q) {
        for(let i of Object.keys(q)) {
            newQ[val] = {
                id: i,
                name: "name" + val,
                artist: q[i].artist,
                img: q[i].album.img,
                album: q[i].album.name,
                duration: msToTime(q[i].duration_ms)
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
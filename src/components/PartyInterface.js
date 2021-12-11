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
    const [baseSongList, setSongList] = useState(undefined);
    const [searchResults, setSearchResults] = useState([]);
    const [nextCheck, setNextCheck] = useState(15 * 1000);

    let songData = [];
    // Handler functions
    const handleSkip = () => {
        let newq = {...getQueue};
        if(Object.keys(newq).length > 1) {
            deleteSong(partyId, Object.keys(newq)[0]);
        }
    }
    const handleAdd = (song) => {
        console.log(song);
        postAddQueue(partyId, song);
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
        getPartyUsers(setUsers, setPartyHost, partyId);
        getPartyQueue(setQueue, partyId);
        // getHistoryData(setHistory, roomCode);
        // postAddSession("123456");
    }, []);
    console.log(partyHost);
    if(partyHost != null) {
        webApi.setAccessToken(partyHost.accessToken);
        let d = setInterval(leaderActions(webApi, getQueue), nextCheck);
        console.log("interval set:" + nextCheck);
    }
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

function leaderActions(webApi, q, nextCheckSetter) {
    console.log("Iran");
    //Get the length of the song and call every interval 
    webApi.getMyCurrentPlayingTrack().then((track) => {
        // console.log("track: " + Object.keys(track));
        // console.log(track.item);
        if(track.item != undefined && q != undefined && (track.item.id != q[Object.keys(q)[0]].id || q[Object.keys(q)[0]].id == q[Object.keys(q)[1]].id)) {
            console.log(track.item.id + " " + q[Object.keys(q)[0]].id);
            // webApi.queue(q[Object.keys(q)[0]].id).then((response) => { //need uri to do this
            //     webApi.skipToNext();
            //     handleskip(); 
            // }, (err) => {
            //     console.log(err);
            // });
        }else {
            // console.log(track != undefined +  " " + q != undefined);
        }
    }, (err) => {
        console.log(err);
    });
    // if(webApi.getMyCurrentPlayingTrack() != Object.keys(q)[0].uri) {
    // }
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
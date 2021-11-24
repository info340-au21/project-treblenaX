import React from 'react';
import SearchModule from './SearchModule.js';
import QueueModule from './QueueModule.js';
import UserInformation from './UserInformation.js';
import CurrentModule from './CurrentModule';
import PlayHistory from './PlayHistoryModule';
import '../css/PartyPortal.css';
import * as songs from '../json/sampleSongs.json';

// Grab Debug Data
import SONG_DATA from '../json/test_data.json';
import { Routes, Router, Route } from 'react-router';

const DEBUG = true;

let queue = [];

/**
 * Main component of the Party Interface page
 */
export function PartyInterface() {
    let songData;
    if (DEBUG) {
        songData = extractPayload(SONG_DATA);
        queue = songData;
    } else {
        // @TODO: put PROD data collection here
    }

    // @TODO: Debug current song - change this for prod
    const currentSong = songData[0];
    
    return (
        <div className="interface-container">
            <UserInformation roomCode="123456" users={ [] } />
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
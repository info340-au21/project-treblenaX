import React, { useState } from 'react';
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
    const [baseSongList, setSongList] = useState(songs.default);
    const handleRemove = (name) => {
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

    // @TODO: Debug current song - change this for prod
    const currentSong = songData[0];
    
    return (
        <div className="interface-container">
            <UserInformation roomCode="123456" users={ SAMPLE_USERS } />
            {/* <div className="flex-item-space"></div> */}
            <SearchModule songData={ songData } addCallBack={handleAdd} />
            <QueueList baseSongList={baseSongList} handleRemove={handleRemove}/>  
            {/* <CurrentModule currentSong={ currentSong } /> */}
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
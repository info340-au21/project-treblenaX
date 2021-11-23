import React from 'react';
import SearchModule from './SearchModule.js';
import QueueModule from './QueueModule.js';
import UserInformation from './UserInformation.js';
import CurrentModule from './CurrentModule';
import '../css/PartyPortal.css';

/**
 * Main component of the Party Interface page
 */
export default function PartyInterface(props) {
    const songData = props.testSongData;
    const currentSong = props.testSongData.tracks.items[0];
    console.log(currentSong);
    return (
        <div className="container">
            <UserInformation roomCode="123456" users={ [] } />
            <SearchModule songData={ songData } />
            <QueueModule songList={ [] }/>  
            <CurrentModule currentSong={ currentSong } />
        </div>
    );
}
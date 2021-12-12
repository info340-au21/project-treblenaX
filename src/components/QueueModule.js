import React, { useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
const COLLAPSED_QUEUE_HEIGHT = "45px";
const EXPANDED_QUEUE_HEIGHT = "20rem";

export default function QueueList(props) {
    // States
    const [isExpanded, setExpanded] = useState(false);
    const [icon, setIcon] = useState(<ExpandMoreIcon />);

    // Props
    const currentSong = props.currentSong;
    const baseSongList = props.baseSongList;
    const handleSkip = props.handleSkip;
    const partyId = props.partyId;
    const username = props.username;

    // Event Handlers
    // Queue button event handler
    const handleCollapse = () => { 
        let element = document.getElementById('queue-list');

        if (!isExpanded) { // If the queue is already collapsed
            element.style.height = EXPANDED_QUEUE_HEIGHT;
            setIcon(<ExpandMoreIcon />);
        } else {    // If the queue is already expanded
            element.style.height = COLLAPSED_QUEUE_HEIGHT;
            setIcon(<ExpandLessIcon />);
        }

        // adjust collapse boolean 
        setExpanded(!isExpanded);
    };

    return ( 
        <div>
            <div id="queue-list" className="flex-item-queue-list">
            <button id="collapse-button" className="queue-header-button" type="button" onClick={ handleCollapse }>
                    <div className="queue-header-container">
                        <h3 className="queue-header-item">Queue</h3>
                        <h3>{icon}</h3>
                    </div>
             </button>
                <div className="song-list">
                    {updateSongList(currentSong, baseSongList, handleSkip)}
                </div>
                <Link to={"/party/" + partyId + "/play-history"} state={{partyId: partyId, username: username}}>
                    <button className="play-history-button" src="">History</button>
                </Link>
            </div>
            <button className="play-history-button" />
        </div>
    )
}


function QueueItem(props) {
    const name = props.name;
    const album = props.album;
    const artist = props.artist;
    const length = props.length;
    const img = props.img;
    const isPlaying = props.isPlaying;
    const handleSkip = props.removeCB;

    return (                    
    <div className={isPlaying ? "queue-item queue-item-playing" : "queue-item"}>
        <div className="queue-album-img">
            <img src={img} alt="album cover" />
        </div>
        <div className={isPlaying ? "queue-item-info queue-item-playing" : "queue-item-info"}>
            {isPlaying && <p>Now playing:</p>}
            <p>{name}</p>
            <p>{artist}</p>
            <p>{album}・{length}</p>
        </div>
        {isPlaying &&<div className="queue-remove-item" id={name} onClick={() => handleSkip(name)}>
            <span className="material-icons">
                <SkipNextIcon/>
            </span>
        </div> }
    </div>
);
} 

function createQueueCard(track, id, isPlaying, handleSkip) {
    return (<QueueItem 
        key={id}
        isPlaying={isPlaying}
        name={track.name} 
        album={track.album} 
        artist={track.artist} 
        length={track.duration} 
        img={track.img} 
        removeCB={handleSkip}
    />);
}

function updateSongList(currentSong, baseSongList, handleSkip) {
    // Init list of cards    
    if (currentSong) {
        const songList = [createQueueCard(currentSong, 0, true, handleSkip)];

        // Map queue data into Song Cards
        if (baseSongList) {
            for (let i = 0; i < baseSongList.length; i++) {
                songList[i + 1] = createQueueCard(baseSongList[i], i + 1, false, handleSkip);
            }
        }
        return songList;
    }
    // ELSE: if there are no current songs then the queue is assumed to be empty
    return null;
}
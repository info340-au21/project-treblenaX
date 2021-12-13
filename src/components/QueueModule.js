import React, { useState, useEffect } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';


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
    const accessToken = props.accessToken;
    const isCurrentSongLoading = props.isCurrentSongLoading;

    const setCurrentSongLoading = (bool) => props.setCurrentSongLoading(bool);

    useEffect(() => {
        if (isCurrentSongLoading) {
            // console.log('rerendering');
            setCurrentSongLoading(false);
        }
    }, []);

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
            <button id="collapse-button" className="queue-header-button" type="button" aria-label="Expand/collapse queue" onClick={ handleCollapse }>
                    <div className="queue-header-container">
                        <div className="queue-header-item">
                            <div>
                                <h1>Queue</h1>
                                { loadingIcon(isCurrentSongLoading)}
                            </div>
                        </div>
                        <h1>{icon}</h1>
                    </div>
             </button>
                <div className="song-list">
                    {updateSongList(currentSong, baseSongList, handleSkip, setCurrentSongLoading, isCurrentSongLoading)}
                </div>
                <Link to={"/party/" + partyId + "/play-history"} state={{partyId: partyId, username: username, accessToken: accessToken}}>
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
    const setLoading = props.setLoading;
    const handleSkip = props.removeCB;
    const isLoading = props.isLoading;

    useEffect(() => {
        // If the current track is rendered then set false after a second
        // Needs timer due to how short the changes are when rendering
        if (isPlaying && isLoading) setTimeout(() => setLoading(false), 1000);
    })

    return (                    
    <div className={isPlaying ? "queue-item queue-item-playing" : "queue-item"}>
    <div className="queue-album-img"><img src={img} alt="album cover art" /></div>
        <div className={isPlaying ? "queue-item-info queue-item-playing" : "queue-item-info"}>
            {isPlaying && <h1>Now playing:</h1>}
            <p className='title'>{name}</p>
            <p className='artist'>{artist}</p>
            <p>{album}・{length}</p>
        </div>
        {isPlaying &&<div className="queue-remove-item" id={name} onClick={() => handleSkip(name)}>
            <span className="material-icons" aria-label='Skip song'>
                <SkipNextIcon/>
            </span>
        </div> }
    </div>
);
} 

function createQueueCard(track, id, isPlaying, handleSkip, setLoading, isCurrentSongLoading) {
    return (<QueueItem 
        key={id}
        isPlaying={isPlaying}
        name={track.name} 
        album={track.album} 
        artist={track.artist} 
        length={track.duration} 
        img={track.img} 
        setLoading={setLoading}
        isLoading={isCurrentSongLoading}
        removeCB={handleSkip}
    />);
}

function updateSongList(currentSong, baseSongList, handleSkip, setLoading, isCurrentSongLoading) {
    // Init list of cards    
    if (currentSong) {
        const songList = [createQueueCard(currentSong, 0, true, handleSkip, setLoading, isCurrentSongLoading)];

        // Map queue data into Song Cards
        if (baseSongList) {
            for (let i = 0; i < baseSongList.length; i++) {
                songList[i + 1] = createQueueCard(baseSongList[i], i + 1, false, handleSkip, setLoading, isCurrentSongLoading);
            }
        }
        // setLoading(false);
        return songList;
    }
    // ELSE: if there are no current songs then the queue is assumed to be empty
    return null;
}

function loadingIcon(isCurrentSongLoading) {
    return (isCurrentSongLoading) ? <FontAwesomeIcon icon={faSpinner} className="queue-loading-icon fa-spin" /> : <span></span>;
}
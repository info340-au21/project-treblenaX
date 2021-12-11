import React, { cloneElement, useState } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { async } from '@firebase/util';
const COLLAPSED_QUEUE_HEIGHT = "45px";
const EXPANDED_QUEUE_HEIGHT = "20rem";

export default function QueueList(props) {
    const [isExpanded, setExpanded] = useState(false);
    const [icon, setIcon] = useState(<ExpandMoreIcon />);
    const [isReady, setReady] = useState(false);
    const baseSongList = props.baseSongList;
    const handleSkip = props.handleSkip;
    const partyId = props.partyId;
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
    let songList = baseSongList.map((cur) => {
        return <QueueItem isPlaying={false} key={cur.id} name={cur.name} album={cur.album} artist={cur.artists} length={cur.duration} img={cur.img} removeCB={handleSkip}/>
    });
    if(isReady == true) {
        songList[0] = cloneElement(songList[0], { isPlaying: true });
    }else if(songList[0] != undefined){
        setReady(true);
    }
    return ( 
        <div>
            <div id="queue-list" className="flex-item-queue-list">
                <div className="queue-header-container">
                    <h3 className="queue-header-item">Queue</h3>
                    <button id="collapse-button" className="queue-header-button" type="button" onClick={ handleCollapse }>{icon}</button>
                </div>
                <div className="song-list">
                    {songList}
                </div>
                <Link to={"/party/" + partyId + "/play-history"} state={partyId}>
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
    <div className="queue-album-img"><img src={img} alt="album cover" /></div>
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
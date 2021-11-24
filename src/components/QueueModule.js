import React, { useState } from 'react';

const COLLAPSED_QUEUE_HEIGHT = "45px";
const EXPANDED_QUEUE_HEIGHT = "20rem";

export default function QueueList(props) {
    const [isExpanded, setExpanded] = useState(false);

    // Queue button event handler
    const handleCollapse = () => { 
        let element = document.getElementById('queue-list');

        if (!isExpanded) { // If the queue is already collapsed
            element.style.height = EXPANDED_QUEUE_HEIGHT;
        } else {    // If the queue is already expanded
            element.style.height = COLLAPSED_QUEUE_HEIGHT;
        }

        // adjust collapse boolean 
        setExpanded(!isExpanded);
    };

    const topimg = "";
    if(props.songList.length > 0) {
        topimg = <QueueTop img={props.songList[0].img} />
    }
    let songList = props.songList.default;
    
    songList = songList.map((cur) => {
        return <QueueItem key={cur.name} name={cur.name} album={cur.album} artist={cur.artist} length={cur.length} img={cur.img}/>
    })
    return (
        <div>
            {topimg}
            <div id="queue-list" className="flex-item-queue-list">
                <div className="queue-header-container">
                    <h3 className="queue-header-item">Queue</h3>
                    {/* @TODO: replace with icon */}
                    <button id="collapse-button" className="queue-header-item" type="button" onClick={ handleCollapse }>Expand</button>
                </div>
                {songList}
            </div>
        </div>
    )
}

function QueueItem(props) {
    const name = props.name;
    const album = props.album;
    const artist = props.artist;
    const length = props.length;
    const img = props.img;
    return (                    
    <div className="queue-item">
    <div className="queue-album-img"><img src={img} alt="album cover" /></div>
        <div className="queue-item-info">
            <p>{name}</p>
            <p>{artist}</p>
            <p>{album}・{length}</p>
        </div>
        <div className="queue-remove-item">
            <span className="material-icons">
                clear
            </span>
        </div>
    </div>
);
} 
function QueueTop(props) {
    return (
    <div className="flex-item-currently-playing">
        <div id="album-image">
            <img href={props.img} />
        </div>
    </div>
    );
}

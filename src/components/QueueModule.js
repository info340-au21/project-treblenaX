import React from 'react';

export default function QueueList(props) {
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
            <div className="flex-item-queue-list">
            <h3 className="queue-header">Queue</h3>
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

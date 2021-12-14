import React from 'react';
import '../css/PartyPortal.css';

export default function CurrentModule(props) {
  const current = props.currentSong;

  // @TODO: handle song data => our model

  return (
    <div className="column-container info-column">
      <div className="flex-item-currently-playing">
        <img className="album-image" src={ current.img } />
      </div>
    </div>
  );
}

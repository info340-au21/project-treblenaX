import React from 'react';
import '../css/PartyPortal.css';
import Spotify from 'spotify-web-api-js';
import $ from 'jquery';
import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';

const redirectUri = 'http://localhost:3000/party/';

/**
 * Main component of the Party Portal page
 */
export default function PartyPortal(props) {
    const spotifyApiRedirect = 'https://accounts.spotify.com/authorize?' +
    $.param({
      response_type: 'code',
      client_id: props.clientId,
      scope: '',
      redirect_uri: redirectUri,
      state: '12345'
    });
    console.log(spotifyApiRedirect);

    return (
        <main className="container">
            <h1 id="banner">Groupify</h1>
                <form id="form-container">
                    <input 
                        id="party-id-field" 
                        name="party-id-field" 
                        type="text" 
                        placeholder="Enter a Party ID" />
                    <label for="party-id-field" className="hidden">Input Party ID</label>
                    <button id="submit-button" type="submit" onClick={
                        (e) => {
                            window.open(spotifyApiRedirect, '_blank');
                        }
                    }>
                        <GroupWorkOutlinedIcon />
                    </button>
                    <label for="submit-button" className="hidden">submit</label>
                </form>
                <a href={spotifyApiRedirect} target='_blank' id="new-party-link">START A NEW PARTY</a>
        </main>
    );
}
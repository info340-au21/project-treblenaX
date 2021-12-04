import React from 'react';
import '../css/PartyPortal.css';
import Spotify from 'spotify-web-api-js';
import $ from 'jquery';
import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';
import { getSessionData } from './FirebaseHandler.js';

const redirectUri = 'http://localhost:3000/auth/';

/**
 * Main component of the Party Portal page
 */
export default function PartyPortal(props) {
    const spotifyApiRedirect = 'https://accounts.spotify.com/authorize?';
    const newPartyUrl = spotifyApiRedirect + $.param({
      response_type: 'code',
      client_id: props.clientId,
      scope: '',
      redirect_uri: redirectUri,
      state: 'someNewPartyIdHere' // TODO: Generate this randomly
    });

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
                            // get the party id from the input field
                            const partyId = document.getElementById('party-id-field').value;

                            // create spotify auth url with that state
                            const existingPartyUrl = spotifyApiRedirect + $.param({
                                response_type: 'code',
                                client_id: props.clientId,
                                scope: '',
                                redirect_uri: redirectUri,
                                state: partyId,
                              });
                            window.open(existingPartyUrl, '_blank');
                        }
                    }>
                        <GroupWorkOutlinedIcon />
                    </button>
                    <label for="submit-button" className="hidden">submit</label>
                </form>
                <a href={newPartyUrl} target='_blank' id="new-party-link">START A NEW PARTY</a>
        </main>
    );
}
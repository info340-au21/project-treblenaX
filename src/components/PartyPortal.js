import React, { useState, useEffect } from 'react';
import '../css/PartyPortal.css';
import $ from 'jquery';
import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';
import { getPartySessions, postAddSession, getPartySession, postAddUser, postAddQueue, getPartyQueue } from './FirebaseHandler';

const redirectUri = 'http://localhost:3000/auth/'; // @TODO: change to deployed
const spotifyApiRedirect = 'https://accounts.spotify.com/authorize?';
const scopes = 'user-read-currently-playing user-read-playback-state user-modify-playback-state';

/**
 * Main component of the Party Portal page
 */
export default function PartyPortal(props) {
    const [allSessions, setSessions] = useState([]);

    useEffect(() => {
        // Get all party sessions
        getPartySessions(setSessions);
    }, []);

    const directToNewParty = () => {
        const partyId = createNewPartyID(allSessions);
        // get username from the input field
        const username = document.getElementById('username').value;

        const newPartyUrl = spotifyApiRedirect + $.param({
            response_type: 'code',
            client_id: props.clientId,
            scope: scopes,
            redirect_uri: redirectUri,
            state: `${partyId}-${username}-true`
        });

        window.open(newPartyUrl, '_blank');
    }
    const directToExistingParty = () => {
        // get the party id from the input field
        const partyId = document.getElementById('party-id-field').value;

        if (checkPartyExists(allSessions, partyId)) {    // IF party exists
            // get username from the input field
            // @TODO: change to React Forms
            const username = document.getElementById('username').value;

            // create spotify auth url with that state
            const existingPartyUrl = spotifyApiRedirect + $.param({
                response_type: 'code',
                client_id: props.clientId,
                scope: scopes,
                redirect_uri: redirectUri,
                state: `${partyId}-${username}-false`,
            });

            window.open(existingPartyUrl, '_blank');
        } 
        else {
            alert("Party doesn't exist.");
            // @TODO: error checking for party
        }
    }

    return (
        <main className="container">
            <h1 id="banner">Groupify</h1>
                <form id="form-container">
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Username"
                        required
                    />
                    <label for="username" className="hidden">Input Username</label>
                    <input 
                        id="party-id-field" 
                        name="party-id-field" 
                        type="text" 
                        placeholder="Enter a Party ID"
                        required />
                    <label for="party-id-field" className="hidden">Input Party ID</label>
                    <button id="submit-button" type="submit" onClick={directToExistingParty}>
                        <GroupWorkOutlinedIcon />
                    </button>
                    <label for="submit-button" className="hidden">submit</label>
                </form>
                {/* @TODO: Make cleaner button */}
                <button onClick={directToNewParty} id="new-party-link">START A NEW PARTY</button>
        </main>
    );
}

/** Private function helpers */
function generateID() {
    let str = '';
    for (let i = 0; i < 6; i++) str += Math.round(Math.random() * 9);
    return str;
}

function checkPartyExists(allSessions, partyId) {
    for (const session in allSessions) if (partyId === session) return true;
    return false;
}

function createNewPartyID(allSessions) {
    let partyId = generateID();
    while (checkPartyExists(allSessions, partyId)) partyId = generateID();
    return partyId;
}
import React, { useState, useEffect } from 'react';
import '../css/PartyPortal.css';
import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';
import { getPartySessions} from './FirebaseHandler';
import InstructionModule from './IntructionModule';

const redirectUri = 'http://localhost:3000/auth/'; // @TODO: change to deployed
const spotifyApiRedirect = 'https://accounts.spotify.com/authorize?';
const scopes = 'user-read-currently-playing user-read-playback-state user-modify-playback-state';

/**
 * Main component of the Party Portal page
 */
export default function PartyPortal(props) {
    const [allSessions, setSessions] = useState([]);
    const [usernameVal, setUName] = useState("");
    const [partyIdVal, setPartyId] = useState("");
    useEffect(() => {
        // Get all party sessions
        getPartySessions(setSessions);
    }, []);

    const userNameInput = (event) => {
        const val = event.target.value;
        setUName(val);
    }
    const partyIdInput = (event) => {
        const val = event.target.value;
        setPartyId(val);
    }
    const directToNewParty = () => {
        const partyId = createNewPartyID(allSessions);
        // get username from the input field
        const username = usernameVal;
        const newPartyUrl = spotifyApiRedirect + encodeObject({
            response_type: 'code',
            client_id: props.clientId,
            scope: scopes,
            redirect_uri: redirectUri,
        }, username, partyId, true);
        window.open(newPartyUrl, '_blank');
    }
    const directToExistingParty = () => {
        // get the party id from the input field
        //store in state
        const partyId = partyIdVal;

        if (checkPartyExists(allSessions, partyId)) {    // IF party exists
            // get username from the input field
            const username = usernameVal;

            // create spotify auth url with that state
            const existingPartyUrl = spotifyApiRedirect + encodeObject({
                response_type: 'code',
                client_id: props.clientId,
                scope: scopes,
                redirect_uri: redirectUri,
            }, username, partyId, false);
            window.open(existingPartyUrl, '_blank');
        } 
        else {
            alert("Party doesn't exist.");
            // @TODO: error checking for party; refreshes becaause of router, can't make anything else stay on screen
        }
    }

    return (
        <main className="container">
            <h1 className="banner">Groupify</h1>
                <form id="form-container">
                    <div className='form-container'>
                            <input
                                id="username"
                                className='username'
                                name="username"
                                type="text"
                                placeholder="Username"
                                onKeyUp={userNameInput}
                                required
                            />
                            <label htmlFor="username" className="hidden">Input Username</label>
                            <input 
                                id="partyIdField"
                                className="party-id-field" 
                                name="party-id-field" 
                                type="text" 
                                placeholder="Enter a Party ID"
                                onKeyUp={partyIdInput}
                                required />
                            <label htmlFor="party-id-field" className="hidden">Input Party ID</label>
                            <button id="submit-button" className='submit-button' type="submit" onClick={directToExistingParty}>
                                Join
                            </button>
                            <label htmlFor="submit-button" className="hidden">submit</label>
                        </div>
                </form>
                {/* @TODO: Make cleaner button */}
                <button onClick={directToNewParty} id="new-party-link">START A NEW PARTY</button>
                <InstructionModule isDisplayed={true} isPortal={true} />
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

function encodeObject(obj, username, id, state) {
    let uri = "";
    for(let i = 0; i < Object.keys(obj).length; i++ ) {
       uri = uri + Object.keys(obj)[i] + "=" + encodeURIComponent(obj[Object.keys(obj)[i]]) + "&";
    }
    uri = uri + "state=" + id + "-" + username + "-" + state;
    return uri;
}
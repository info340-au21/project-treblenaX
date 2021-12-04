import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
// Import config file
import CONFIG from '../json/config.json';
import { updateUsers } from './PartyInterface.js';

const firebaseConfig = {
  apiKey: CONFIG.firebaseApiKey,
  authDomain: "https://groupify-ae530.firebaseapp.com",
  databaseURL: "https://groupify-ae530-default-rtdb.firebaseio.com/",
  storageBucket: "groupify-ae530.appspot.com"
}

let app = initializeApp(firebaseConfig);;
let database = getDatabase(app);

/**
 * Gets the specific party_session data and listens for changes
 * 
 * @param {string} sessionId    -   The party session ID
 */
export function getSessionData(sessionId) {
    const dbRef = ref(database, 'party_sessions/' + sessionId);
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
    });
}

/**
 * Gets the UserInformation data and listens for changes
 * 
 * @param {string} sessionId         -   The party session ID
 */
export function getUserInformationData(setUsers, sessionId) {
    const url = CONFIG.routes.parties + sessionId + CONFIG.routes.users;
    const dbRef = ref(database, url);
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        setUsers(data);
    });
}
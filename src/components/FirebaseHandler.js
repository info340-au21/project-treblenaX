import { initializeApp } from 'firebase/app';
import { getDatabase, get, ref, onValue, set, push, child } from 'firebase/database';
// Import config file
import CONFIG from '../json/config.json';

const firebaseConfig = {
  apiKey: CONFIG.firebaseApiKey,
  authDomain: "https://groupify-ae530.firebaseapp.com",
  databaseURL: "https://groupify-ae530-default-rtdb.firebaseio.com/",
  storageBucket: "groupify-ae530.appspot.com"
}

let app = initializeApp(firebaseConfig);;
let database = getDatabase(app);

// GET functions
export function getPartySessions(setSessions) {
    const url = CONFIG.routes.parties;
    const dbRef = ref(database);
    get(child(dbRef, url)).then((snapshot) => {
        const data = snapshot.val();
        setSessions(data);
    });
}
/**
 * Gets the UserInformation data and listens for changes
 * @param {function} setUsers
 * @param {string} sessionId         -   The party session ID
 */
export function getPartyUsers(setUsers, sessionId) {
    const url = CONFIG.routes.parties + sessionId + CONFIG.routes.users;
    const dbRef = ref(database, url);
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        setUsers(data);
    });
}

/**
 * Gets the Queue data and listens for changes
 * @param {function} setQueue 
 * @param {string} sessionId 
 */
export function getPartyQueue(setQueue, sessionId) {
    const url = CONFIG.routes.parties + sessionId + CONFIG.routes.queue;
    const dbRef = ref(database, url);
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        setQueue(data);
    });
}

/**
 * Gets the History data and listens for changes
 * @param {*} setHistory 
 * @param {*} sessionId 
 */
export function getHistoryData(setHistory, sessionId) {
    const url = CONFIG.routes.parties + sessionId + CONFIG.routes.history;
    const dbRef = ref(database, url);
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        setHistory(data);
    });
}

// POST functions
/**
 * Adds `user` to PartySession with the specified `sessionId`
 * @param {string} sessionId 
 * @param {Object} user 
 */
export function postAddUser(sessionId, user) {
    const url = CONFIG.routes.parties + sessionId + CONFIG.routes.users;
    const dbRef = push(ref(database, url));
    set(dbRef, user);
}

/**
 * Adds `song` to Queue with the specified `sessionId`
 * @param {string} sessionId 
 * @param {Object} song 
 */
export function postAddQueue(sessionId, song) {
    const url = CONFIG.routes.parties + sessionId + CONFIG.routes.queue;
    const dbRef = push(ref(database, url));
    set(dbRef, song)
}

/**
 * Adds `song` to History with the specified `sessionId`
 * @param {string} sessionId 
 * @param {Object} song 
 */
export function postAddHistory(sessionId, song) {
    const url = CONFIG.routes.parties + sessionId + CONFIG.routes.history;
    const dbRef = push(ref(database, url));
    set(dbRef, song);
}



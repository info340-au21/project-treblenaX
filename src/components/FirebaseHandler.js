import { initializeApp } from 'firebase/app';
import { getDatabase, get, ref, onValue, set, push, child, remove } from 'firebase/database';
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

export function getPartyUserByUsername(setUser, sessionId, username) {
    const url = CONFIG.routes.parties + sessionId + CONFIG.routes.users;
    console.log(url);
    const dbRef = ref(database, url);
    get(dbRef)
        .then((snapshot) => {
            const data = snapshot.val();
            const u = filterByUsername(data, username);
            setUser(u);
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
    console.log(user);
    const url = CONFIG.routes.parties + sessionId + CONFIG.routes.users;
    const dbRef = push(ref(database, url));

    user.refKey = dbRef.key;
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

// DELETE functions
export function deleteUser(sessionId, user) {
    const url = CONFIG.routes.parties + sessionId + CONFIG.routes.users + user.refKey;
    const dbRef = ref(database, url);
    remove(dbRef);
}

export function deleteSession(sessionId) {
    const url = CONFIG.routes.parties + sessionId;
    const dbRef = ref(database, url);
    console.log(dbRef);
    remove(dbRef);
}

export function deleteSong(sessionId, songid) {
    const url = CONFIG.routes.parties + sessionId + CONFIG.routes.queue + songid;
    const dbRef = ref(database, url);
    remove(dbRef);
}

/** Private helper functions */
function filterByUsername(users, username) {
    for (let u in users) {
        const user = users[u];
        if (user.username === username) {
            return user;
        };
    }
}

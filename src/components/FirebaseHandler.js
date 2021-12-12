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
 * @param {function} setRoomHost
 * @param {string} partyId         -   The party session ID
 */
export function getPartyUsers(setUsers, setPartyHost, partyId) {
    const url = CONFIG.routes.parties + partyId + CONFIG.routes.users;
    const dbRef = ref(database, url);
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        setUsers(data);

        // Filter for room host
        let host;

        for (let key in data) {
            const user = data[key];
            if (user.host) host = user;
        }
        setPartyHost(host);
    });
}

// @TODO: More generalized get party users

export function getPartyUserByUsername(setUser, partyId, username) {
    const url = CONFIG.routes.parties + partyId + CONFIG.routes.users;
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
 * @param {string} partyId 
 */
export function getPartyQueue(setQueue, partyId) {
    const url = CONFIG.routes.parties + partyId + CONFIG.routes.queue;
    const dbRef = ref(database, url);
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        setQueue(data);
    });
}

/**
 * Gets the History data and listens for changes
 * @param {*} setHistory 
 * @param {*} partyId 
 */
export function getHistoryData(setHistory, partyId) {
    const url = CONFIG.routes.parties + partyId + CONFIG.routes.history;
    console.log(url);
    const dbRef = ref(database, url);
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        setHistory(data);
    });
}

// POST functions
/**
 * Adds `user` to PartySession with the specified `partyId`
 * @param {string} partyId 
 * @param {Object} user 
 */
export function postAddUser(partyId, user) {
    const url = CONFIG.routes.parties + partyId + CONFIG.routes.users;
    const dbRef = push(ref(database, url));

    user.refKey = dbRef.key;
    set(dbRef, user);
}

/**
 * Adds `song` to Queue with the specified `partyId`
 * @param {string} partyId 
 * @param {Object} song 
 */
export function postAddQueue(partyId, song) {
    const url = CONFIG.routes.parties + partyId + CONFIG.routes.queue;
    const dbRef = push(ref(database, url));
    const payload = {
        refKey: dbRef.key,
        ...song
    };

    console.log(payload);
    set(dbRef, payload);
}

/**
 * Adds `song` to History with the specified `partyId`
 * @param {string} partyId 
 * @param {Object} song 
 */
export function postAddHistory(partyId, song) {
    const url = CONFIG.routes.parties + partyId + CONFIG.routes.history;
    const dbRef = push(ref(database, url));
    set(dbRef, song);
}

// DELETE functions
export function deleteUser(partyId, user) {
    const url = CONFIG.routes.parties + partyId + CONFIG.routes.users + user.refKey;
    const dbRef = ref(database, url);
    remove(dbRef);
}

export function deleteSession(partyId) {
    const url = CONFIG.routes.parties + partyId;
    const dbRef = ref(database, url);
    remove(dbRef);
}

export function deleteSongByRef(partyId, songRef) {
    const url = CONFIG.routes.parties + partyId + CONFIG.routes.queue + songRef;
    const dbRef = ref(database, url);
    remove(dbRef);
}

export function deleteSongById(partyId, songId) {
    const url = CONFIG.routes.parties + partyId + CONFIG.routes.queue;
    const dbRef = ref(database, url);
    get(dbRef)
        .then((snapshot) => {
            const data = snapshot.val();
            const song = filterById(data, songId);
            deleteSongByRef(partyId, song.refKey);
    });
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

function filterById(queue, id) {
    for (let s in queue) {
        const song = queue[s];
        if (song.id === id) return song;
    }
}

import {initializeApp} from 'firebase/app';
import {getDatabase, get, ref, onValue, set, push, child, remove} from 'firebase/database';
// Import config file
import CONFIG from '../json/config.json';
import ErrorSnackbar from './ErrorSnackbar.js';

const firebaseConfig = {
  apiKey: CONFIG.firebaseApiKey,
  authDomain: 'https://groupify-ae530.firebaseapp.com',
  databaseURL: 'https://groupify-ae530-default-rtdb.firebaseio.com/',
  storageBucket: 'groupify-ae530.appspot.com',
};

const app = initializeApp(firebaseConfig); ;
const database = getDatabase(app);

// GET functions
export function getPartySessions(setSessions, setError) {
  const url = CONFIG.routes.parties;
  const dbRef = ref(database, url);
  onValue(dbRef,
      (snapshot) => {
        const data = snapshot.val();
        setSessions(data);
      }, (error) => setError(<ErrorSnackbar msg={error.message} setError={setError} />));
}
/**
 * Gets the UserInformation data and listens for changes
 * @param {function} setUsers
 * @param {function} setRoomHost
 * @param {string} partyId         -   The party session ID
 */
export function getPartyUsersAndSetHost(setUsers, setUsersLoaded, setPartyHost, setError, partyId) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.users;
  const dbRef = ref(database, url);
  onValue(dbRef, (snapshot) => {
    if (snapshot.exists) {
      const data = snapshot.val();
      const users = [];
      let host;

      for (const key in data) {
        const user = data[key];
        if (user.host) host = user; // Filter for room host

        const newUser = {
          imgPath: generateUserPhoto(), // Generate new photo for user
          ...user,
        };
        users.push(newUser);
      }

      setPartyHost(host);
      setUsers(users);

      setUsersLoaded(true);
    } else {
      setError(<ErrorSnackbar msg={'Can\'t find party users in snapshot. Please redirect back to the home page.'} />);
    }
  }, (error) => setError(<ErrorSnackbar msg={error.message} setError={setError} />));
}

export function getPartyUserByUsername(setUser, setUserLoaded, setError, partyId, username) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.users;
  const dbRef = ref(database, url);
  get(dbRef)
      .then((snapshot) => {
        const data = snapshot.val();
        const u = filterByUsername(data, username);
        setUser(u);
      })
      .catch((error) => setError(<ErrorSnackbar msg={error.message} setError={setError} />))
      .then(() => setUserLoaded(true));
}

/**
 * Gets the Queue data and listens for changes
 * @param {function} setQueue
 * @param {string} partyId
 */
export function getPartyQueue(setQueue, setQueueLoaded, setError, partyId) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.queue;
  const dbRef = ref(database, url);
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    setQueue(data);
    setQueueLoaded(true);
  }, (error) => setError(<ErrorSnackbar msg={error.message} setError={setError} />));
}

/**
 * Gets the History data and listens for changes
 * @param {*} setHistory
 * @param {*} partyId
 */
export function getHistoryData(setHistory, setError, partyId) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.history;
  const dbRef = ref(database, url);
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    setHistory(data);
  }, (error) => setError(<ErrorSnackbar msg={error.message} setError={setError} />));
}

// POST functions
/**
 * Adds `user` to PartySession with the specified `partyId`
 * @param {string} partyId
 * @param {Object} user
 */
export function postAddUser(setError, partyId, user) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.users;
  const dbRef = push(ref(database, url));

  user.refKey = dbRef.key;
  set(dbRef, user)
      .catch((error) => setError(<ErrorSnackbar msg={error.message} setError={setError} />));
}

/**
 * Adds `song` to Queue with the specified `partyId`
 * @param {string} partyId
 * @param {Object} song
 */
export function postAddQueue(setError, partyId, song) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.queue;
  const dbRef = push(ref(database, url));
  const payload = {
    refKey: dbRef.key,
    ...song,
  };

  set(dbRef, payload)
      .catch((error) => setError(<ErrorSnackbar msg={error.message} setError={setError} />));
}

/**
 * Adds `song` to History with the specified `partyId`
 * @param {string} partyId
 * @param {Object} song
 */
export function postAddHistory(setError, partyId, song) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.history;
  const dbRef = push(ref(database, url));
  set(dbRef, song)
      .catch((error) => setError(<ErrorSnackbar msg={error.message} setError={setError} />));
}

// DELETE functions
export function deleteUser(setError, partyId, user) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.users + user.refKey;
  const dbRef = ref(database, url);
  remove(dbRef)
      .catch((error) => setError(<ErrorSnackbar msg={error.message} setError={setError} />));
}

export function deleteSession(setError, partyId) {
  const url = CONFIG.routes.parties + partyId;
  const dbRef = ref(database, url);
  remove(dbRef)
      .catch((error) => setError(<ErrorSnackbar msg={error.message} setError={setError} />));
}

export function deleteSongByRef(setError, partyId, songRef) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.queue + songRef;
  const dbRef = ref(database, url);
  remove(dbRef)
      .catch((error) => setError(<ErrorSnackbar msg={error.message} setError={setError} />));
}

export function deleteSongById(setError, partyId, songId) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.queue;
  const dbRef = ref(database, url);
  get(dbRef)
      .then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          const song = filterById(data, songId);

          if (song) {
            deleteSongByRef(setError, partyId, song.refKey);
          } else { } // Song is not found in the queue - assumed to have queued from Spotify
        }
      })
      .catch((error) => setError(<ErrorSnackbar msg={error.message} setError={setError} />));
}

/** Private helper functions */
function filterByUsername(users, username) {
  for (const u in users) {
    const user = users[u];
    if (user.username === username) {
      return user;
    };
  }
  return null;
}

function filterById(queue, id) {
  for (const s in queue) {
    const song = queue[s];
    if (song.id === id) return song;
  }
  return null;
}

function generateUserPhoto() {
  let path = '../img/profile_pictures/img_';

  const num = 1 + Math.floor(Math.random() * 4);

  path += num + '.PNG';

  return path;
}


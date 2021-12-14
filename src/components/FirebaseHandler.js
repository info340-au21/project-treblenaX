import {initializeApp} from 'firebase/app';
import {getDatabase, get, ref, onValue, set, push, child, remove} from 'firebase/database';
// Import config file
import CONFIG from '../json/config.json';

const firebaseConfig = {
  apiKey: CONFIG.firebaseApiKey,
  authDomain: 'https://groupify-ae530.firebaseapp.com',
  databaseURL: 'https://groupify-ae530-default-rtdb.firebaseio.com/',
  storageBucket: 'groupify-ae530.appspot.com',
};

const app = initializeApp(firebaseConfig); ;
const database = getDatabase(app);

// GET functions
export function getPartySessions(setSessions) {
  const url = CONFIG.routes.parties;
  const dbRef = ref(database, url);
  onValue(dbRef,
      (snapshot) => {
        const data = snapshot.val();
        setSessions(data);
      }, (error) => {
        alert('Failed to grab party session.');
        console.log(error);
      });
}
/**
 * Gets the UserInformation data and listens for changes
 * @param {function} setUsers
 * @param {function} setRoomHost
 * @param {string} partyId         -   The party session ID
 */
export function getPartyUsersAndSetHost(setUsers, setUsersLoaded, setPartyHost, partyId) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.users;
  const dbRef = ref(database, url);
  onValue(dbRef, (snapshot) => {
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
  }, (error) => {
    alert('Failed to grab party users.');
    console.log(error);
  });
}

export function getPartyUserByUsername(setUser, setUserLoaded, partyId, username) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.users;
  const dbRef = ref(database, url);
  get(dbRef)
      .then((snapshot) => {
        const data = snapshot.val();
        const u = filterByUsername(data, username);
        setUser(u);
      })
      .catch((err) => {
        alert('Failed to get party user by username.');
        console.log(err);
      })
      .then(() => setUserLoaded(true));
}

/**
 * Gets the Queue data and listens for changes
 * @param {function} setQueue
 * @param {string} partyId
 */
export function getPartyQueue(setQueue, setQueueLoaded, partyId) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.queue;
  const dbRef = ref(database, url);
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    setQueue(data);
    setQueueLoaded(true);
  }, (error) => {
    alert('Failed to grab party queue.');
    console.log(error);
  });
}

/**
 * Gets the History data and listens for changes
 * @param {*} setHistory
 * @param {*} partyId
 */
export function getHistoryData(setHistory, partyId) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.history;
  const dbRef = ref(database, url);
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    setHistory(data);
  }, (error) => {
    alert('Failed to grab party history.');
    console.log(error);
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
  set(dbRef, user)
      .catch((err) => {
        alert('Failed to get party user by username.');
        console.log(err);
      });
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
    ...song,
  };

  set(dbRef, payload)
      .catch((err) => {
        alert('Failed to post song to party queue.');
        console.log(err);
      });
}

/**
 * Adds `song` to History with the specified `partyId`
 * @param {string} partyId
 * @param {Object} song
 */
export function postAddHistory(partyId, song) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.history;
  const dbRef = push(ref(database, url));
  set(dbRef, song)
      .catch((err) => {
        alert('Failed to post song to party history.');
        console.log(err);
      });
}

// DELETE functions
export function deleteUser(partyId, user) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.users + user.refKey;
  const dbRef = ref(database, url);
  remove(dbRef)
      .catch((err) => {
        alert('Failed to delete user.');
        console.log(err);
      });
}

export function deleteSession(partyId) {
  const url = CONFIG.routes.parties + partyId;
  const dbRef = ref(database, url);
  remove(dbRef)
      .catch((err) => {
        alert('Failed to delete session.');
        console.log(err);
      });
}

export function deleteSongByRef(partyId, songRef) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.queue + songRef;
  const dbRef = ref(database, url);
  remove(dbRef)
      .catch((err) => {
        alert('Could not find song by refKey.');
        console.log(err);
      });
}

export function deleteSongById(partyId, songId) {
  const url = CONFIG.routes.parties + partyId + CONFIG.routes.queue;
  const dbRef = ref(database, url);
  get(dbRef)
      .then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          const song = filterById(data, songId);
          deleteSongByRef(partyId, song.refKey);
        }
      })
      .catch((err) => {
          // Couldn't delete song but its fine
      });
}

/** Private helper functions */
function filterByUsername(users, username) {
  for (const u in users) {
    const user = users[u];
    if (user.username === username) {
      return user;
    };
  }
}

function filterById(queue, id) {
  for (const s in queue) {
    const song = queue[s];
    if (song.id === id) return song;
  }
}

function generateUserPhoto() {
  let path = '../img/profile_pictures/img_';

  const num = 1 + Math.floor(Math.random() * 4);

  path += num + '.PNG';

  return path;
}


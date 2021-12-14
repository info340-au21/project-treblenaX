import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {selectClasses} from '@mui/material';
import {deleteUser, deleteSession} from './FirebaseHandler';
const EXPANDED_MENU_HEIGHT = '250px';
const COLLAPSED_MENU_HEIGHT = '50px';

// partyId as a string starting with '#' followed by digits and letters
// userName as a Object collection of users ('name', 'photo' and 'id')
export default function UserInformation(props) {
  const partyId = props.partyId;
  const users = props.users;
  const user = props.user;
  const sidenavRef = React.createRef();
  const partyIdRef = React.createRef();
  const usersListRef = React.createRef();
  const leaveButtonRef = React.createRef();
  // States
  const [isExpanded, setExpanded] = useState(false);
  const [icon, setIcon] = useState(<ArrowForwardIosIcon />);

  /** Handler functions */
  // User Information event handler
  const handleCollapse = () => {
    const sidenav = sidenavRef.current;
    const partyId = partyIdRef.current;
    const usersList = usersListRef.current;
    const leaveButton = leaveButtonRef.current;
    if (!isExpanded) { // If the queue is already collapsed
      sidenav.style.flex = '0 1 ' + EXPANDED_MENU_HEIGHT;

      partyId.style.writingMode = 'horizontal-tb';
      partyId.style.transform = 'rotate(0deg)';
      usersList.style.display = 'block';
      sidenav.classList.add = 'shown';
      leaveButton.style.display = 'block';
      setIcon(<ArrowBackIosNewIcon />);
    } else { // If the queue is already expanded
      sidenav.style.flex = '0 1 ' + COLLAPSED_MENU_HEIGHT;

      partyId.style.writingMode = 'vertical-rl';
      partyId.style.transform = 'rotate(180deg)';
      usersList.style.display = 'none';
      sidenav.classList.add = 'hidden';
      leaveButton.style.display = 'none';
      setIcon(<ArrowForwardIosIcon />);
    }
    setExpanded(!isExpanded);
  };

  const leaveParty = () => {
    // if user is host, send a message to the server to remove the party
    // if user is not host, send a message to the server to remove the user from the party and naviate to the home page
    if (user.host) deleteSession(partyId);
    else deleteUser(partyId, user);
    window.location.href = '/';
  };

  return (
    <div id="mySidenav" ref={sidenavRef} className="column-container user-column sidenav">
      <button type="button" className="closebtn btn" aria-label="Expand/Collapse user menu" onClick={handleCollapse}>{icon}</button>
      <div className="user-content">
        <div id="room-code" ref={partyIdRef} className="flex-item-room-code">
          <h1>Room Code: {partyId}</h1>
        </div>

        <div id="user-list" ref={usersListRef} className="flex-item-users">
          <h1 className="user-title">Users</h1>
          <ul>
            <UserList users={users}/>
          </ul>
        </div>
      </div>
      <button type="button" id="leavebtn" ref={leaveButtonRef} className="btn leavebtn" onClick={leaveParty}>Leave Party</button>
    </div>
  );
}

// takes the users as an array of objects with ('name' and 'id') and tranforms them into a list of li elements
function UserList(props) {
  const users = props.users;

  let userElement = null;

  if (users.length !== 0) {
    userElement = users.map((user) => {
      return <UserCard key={user.refKey} user={user} />;
    });
  }

  return userElement;
}

function UserCard(props) {
  const user = props.user;

  return (
    <div className="user-item">
      <img className="user-photo" src={user.imgPath} alt={user.name}/>
      <li className="user-name">{user.username} {user.host && <span>(Host)</span>}</li>
    </div>
  );
}

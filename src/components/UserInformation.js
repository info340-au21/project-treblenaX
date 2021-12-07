import React, { useState } from "react";
import { useParams } from "react-router";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { selectClasses } from "@mui/material";
const EXPANDED_MENU_HEIGHT = "250px";
const COLLAPSED_MENU_HEIGHT = "50px";

// roomCode as a string starting with '#' followed by digits and letters
// userName as a Object collection of users ('name', 'photo' and 'id')
export default function UserInformation(props) {
    // Grab party ID from urlParams
    const urlParams = useParams();
    
    // @TODO: change this to get the room code
    const roomCode = props.roomCode;

    // States
    const [isExpanded, setExpanded] = useState(false);
    const [icon, setIcon] = useState(<ArrowForwardIosIcon />);

    // User Information event handler
    const handleCollapse = () => {
        let sidenav = document.getElementById('mySidenav');
        let roomCode = document.getElementById('room-code');
        let usersList = document.getElementById('user-list');
        let leaveButton = document.getElementById('leavebtn');
        if (!isExpanded) { // If the queue is already collapsed
            sidenav.style.flex = "0 1 " + EXPANDED_MENU_HEIGHT;

            roomCode.style.writingMode = "horizontal-tb";
            roomCode.style.transform = "rotate(0deg)";
            usersList.style.display = "block";
            sidenav.classList.add = "shown";
            leaveButton.style.display = "block";
            setIcon(<ArrowBackIosNewIcon />);
        } else {    // If the queue is already expanded
            sidenav.style.flex = "0 1 " + COLLAPSED_MENU_HEIGHT;

            roomCode.style.writingMode = "vertical-rl";
            roomCode.style.transform = "rotate(180deg)";
            usersList.style.display = "none";
            sidenav.classList.add = "hidden";
            leaveButton.style.display = "none";
            setIcon(<ArrowForwardIosIcon />);
        }
        // console.log(isExpanded);
        setExpanded(!isExpanded);
    }

    return (
        <div id="mySidenav" className="column-container user-column sidenav">
            <button type="button" className="closebtn btn" onClick={handleCollapse}>{icon}</button>
            <div className="user-content">
                <div id="room-code" className="flex-item-room-code">
                    <h1>#{roomCode}</h1>
                </div>

                <div id="user-list" className="flex-item-users">
                    <h1 className="user-title">Users</h1>
                    <ul>
                        <UserList getUsers={props.getUsers}/>
                    </ul>
                </div>
            </div>
            <button type="button" id="leavebtn" className="btn leavebtn" onClick={leaveParty}>Leave Party</button>
        </div>
    );
}

// takes the users as an array of objects with ('name' and 'id') and tranforms them into a list of li elements
function UserList(props) {
    const users = props.getUsers;

    let userElement = users.map((user) => {
        if (user.host) {
            return (
                <div className="user-item" key={user.id}>
                    <img className="user-photo" src={user.photo} alt={user.name}/>
                    <li className="user-name">{user.username} (Host)</li>
                </div>
            )
        } else {
            return (
                <div className="user-item" key={user.id}>
                    <img className="user-photo" src={user.photo} alt={user.name}/>
                    <li className="user-name">{user.name}</li>
                </div>
            )
        }
    });
    return userElement;
}

/* Set the width of the side navigation to 250px */
const openNav = () => {
    let nav = document.getElementById("mySidenav");
    nav.classList.add = "shown";
}

/* Set the width of the side navigation to 0 */
const closeNav = () => {
    let nav = document.getElementById("mySidenav");
    nav.classList.add = "hidden";
}

function leaveParty() {
    console.log("Leaving party");
    // if user is host, send a message to the server to remove the party
    // if user is not host, send a message to the server to remove the user from the party and naviate to the home page
    if (false) { // change this to check if the user is the host
        // send message to server to remove party
        console.log("Host is leaving party");
    } else {
        // send message to server to remove user from party
        console.log("User is leaving party");
        window.location.href = "/";
    }
}
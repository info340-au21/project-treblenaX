import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { selectClasses } from "@mui/material";
import { deleteUser, deleteSession } from "./FirebaseHandler";
const EXPANDED_MENU_HEIGHT = "250px";
const COLLAPSED_MENU_HEIGHT = "50px";

// partyId as a string starting with '#' followed by digits and letters
// userName as a Object collection of users ('name', 'photo' and 'id')
export default function UserInformation(props) {
    const partyId = props.partyId;
    const user = props.user;
    // States
    const [isExpanded, setExpanded] = useState(false);
    const [icon, setIcon] = useState(<ArrowForwardIosIcon />);

    /** Handler functions */
    // User Information event handler
    const handleCollapse = () => {
        let sidenav = document.getElementById('mySidenav');
        let partyId = document.getElementById('room-code');
        let usersList = document.getElementById('user-list');
        let leaveButton = document.getElementById('leavebtn');
        if (!isExpanded) { // If the queue is already collapsed
            sidenav.style.flex = "0 1 " + EXPANDED_MENU_HEIGHT;

            partyId.style.writingMode = "horizontal-tb";
            partyId.style.transform = "rotate(0deg)";
            usersList.style.display = "block";
            sidenav.classList.add = "shown";
            leaveButton.style.display = "block";
            setIcon(<ArrowBackIosNewIcon />);
        } else {    // If the queue is already expanded
            sidenav.style.flex = "0 1 " + COLLAPSED_MENU_HEIGHT;

            partyId.style.writingMode = "vertical-rl";
            partyId.style.transform = "rotate(180deg)";
            usersList.style.display = "none";
            sidenav.classList.add = "hidden";
            leaveButton.style.display = "none";
            setIcon(<ArrowForwardIosIcon />);
        }
        setExpanded(!isExpanded);
    }

    const leaveParty = () => {
        // if user is host, send a message to the server to remove the party
        // if user is not host, send a message to the server to remove the user from the party and naviate to the home page
        if (user.host) deleteSession(partyId);
        else deleteUser(partyId, user);
        window.location.href = "/";
    }

    return (
        <div id="mySidenav" className="column-container user-column sidenav">
            <button type="button" className="closebtn btn" onClick={handleCollapse}>{icon}</button>
            <div className="user-content">
                <div id="room-code" className="flex-item-room-code">
                    <h1>#{partyId}</h1>
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

    let userElement = null;

    if (users.length !== 0) {
        userElement = Object.keys(users).map((key) => {
            const user = users[key];

            // @TODO: generate random user photos for the user
            if (user.host) {
                return (
                    <div className="user-item" key={user.id}>
                        <img className="user-photo" src={generateUserPhotos()} alt={user.name}/>
                        <li className="user-name">{user.username} (Host)</li>
                    </div>
                )
            } else {
                return (
                    <div className="user-item" key={user.id}>
                        <img className="user-photo" src={generateUserPhotos()} alt={user.name}/>
                        <li className="user-name">{user.name}</li>
                    </div>
                )
            }
        });
    }

    return userElement;
}

/** Private functions */
function generateUserPhotos() {
    let path = '../img/profile_pictures/img_';

    const num = Math.floor(Math.random() * 5);

    path += num + '.PNG';

    return path;
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
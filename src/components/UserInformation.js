import React, { useState } from "react";
import { useParams } from "react-router";

const EXPANDED_MENU_HEIGHT = "250px";
const COLLAPSED_MENU_HEIGHT = "50px";

// roomCode as a string starting with '#' followed by digits and letters
// userName as a Object collection of users ('name', 'photo' and 'id')
export default function UserInformation(props) {
    // Grab party ID from urlParams
    const urlParams = useParams();
    
    // @TODO: change this to get the room code
    const roomCode = props.roomCode;
    const users = props.users;

    // States
    const [isExpanded, setExpanded] = useState(false);

    // User Information event handler
    const handleCollapse = () => {
        let sidenav = document.getElementById('mySidenav');
        let roomCode = document.getElementById('room-code');
        let usersList = document.getElementById('user-list');

        if (!isExpanded) { // If the queue is already collapsed
            sidenav.style.flex = "0 1 " + EXPANDED_MENU_HEIGHT;

            roomCode.style.writingMode = "horizontal-tb";
            roomCode.style.transform = "rotate(0deg)";
            usersList.style.display = "block";
            sidenav.classList.add = "shown";
        } else {    // If the queue is already expanded
            sidenav.style.flex = "0 1 " + COLLAPSED_MENU_HEIGHT;

            roomCode.style.writingMode = "vertical-rl";
            roomCode.style.transform = "rotate(180deg)";
            usersList.style.display = "none";
            sidenav.classList.add = "hidden";
        }
        console.log(isExpanded);
        setExpanded(!isExpanded);
    }

    // if (window.innerWidth < 641) {
    //     return (
    //         <div id="mySidenav" className="column-container user-column sidenav">
    //             <a href="*" className="openbtn btn" onClick={openNav}>{">"}</a>
    //             <div className="user-content">
    //                 <div className="flex-item-room-code horizontal">
    //                     <h1>#{roomCode}</h1>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // } else {
    return (
        <div id="mySidenav" className="column-container user-column sidenav">
            <button type="button" className="closebtn btn" onClick={handleCollapse}>&times;</button>
            <div className="user-content">
                <div id="room-code" className="flex-item-room-code">
                    <h1>#{roomCode}</h1>
                </div>

                <div id="user-list" className="flex-item-users">
                    <h1 className="user-title">Users</h1>
                    <ul>
                        <UserList users={users}/>
                    </ul>
                </div>
            </div>
        </div>
    );
}

// takes the users as an array of objects with ('name' and 'id') and tranforms them into a list of li elements
function UserList(props) {
    const users = props.users;

    let userElement = users.map((user) => {
        if (user.host) {
            return (
                <div className="user-item" key={user.id}>
                    <img className="user-photo" src={user.photo} alt={user.name}/>
                    <li className="user-name">{user.name} (Host)</li>
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
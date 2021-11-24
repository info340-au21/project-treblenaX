import React from "react";
import { useParams } from "react-router";

// roomCode as a string starting with '#' followed by digits and letters
// userName as a Object collection of users ('name', 'photo' and 'id')
export default function UserInformation(props) {
    // Grab party ID from urlParams
    const urlParams = useParams();
    
    const roomCode = urlParams.partyId;
    const users = props.users || [];

    return (
        <div className="column-container user-column">
            <div className="user-content">
                <div className="flex-item-room-code">
                    <h1>#{roomCode}</h1>
                </div>

                <div className="flex-item-users">
                    <h1 className="user-title">Users</h1>
                    <ul>
                        <UserList users={users}/>
                    </ul>
                </div>
                <div className="flex-item-space">
                    
                </div>
            </div>
        </div>
    )
}

// takes the users as an array of objects with ('name' and 'id') and tranforms them into a list of li elements
function UserList(props) {
    const users = props.users;

    console.log(users);

    let userElement = users.map((user) => {
        return (
            <div className="user-item" key={user.id}>
                <img className="user-photo" src={user.photo} alt={user.name}/>
                <li className="user-name">{user.name}</li>
            </div>
        )
    });
    return userElement;
}
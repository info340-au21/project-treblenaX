import React from "react";

// roomCode as a string starting with '#' followed by digits and letters
// userName as a Object collection of users ('name' and 'id')
export const UserInformation = ({roomCode, users}) => {
    return (
        <div className="column-container user-column">
            <div id="room-code">
                <h1>{roomCode}</h1>
            </div>

            <div className="flex-item-users">
                <h1>Users</h1>
                <ul>
                    <UserList users={users}/>
                </ul>
            </div>
        </div>
    )
};

// takes the users as an array of objects with ('name' and 'id') and tranforms them into a list of li elements
const UserList = ({users}) => {
    let userElement = users.map((user) => {
        return <li>{user.name}</li>
    });
    return userElement;
};
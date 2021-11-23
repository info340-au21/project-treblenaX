import React from "react";

// roomCode as a string starting with '#' followed by digits and letters
// userName as a Object collection of users ('name' and 'id')
export default function UserInformation(props) {
    const roomCode = props.roomCode;
    const users = props.users || [];

    return (
        <div className="column-container user-column">
            <div className="user-content">
                <div className="flex-item-room-code">
                    <h1>{roomCode}</h1>
                </div>

                <div className="flex-item-users">
                    <h1>Users</h1>
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

    let userElement = users.map((user) => {
        return <li>{user.name}</li>
    });
    return userElement;
}
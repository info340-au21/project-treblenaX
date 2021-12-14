import React from "react";
import "../css/InstructionModule.css";

export default function InstructionModule(props) {
    let isDisplayed = props.isDisplayed;
    if (!isDisplayed) {
        return null;
    } else if (props.isPortal) {
        return (
            <div id="instruction-module" className="instruction-module instruction-module-portal">
                <h1>Enter a username to get started!</h1>
                <ol>
                    <div className="two-columns-layout">
                        <div className="text-column">
                            <strong>Hosts - </strong>
                                <ul>
                                    <li className="text-column-item">Press "START A NEW PARTY" to host a new party - a party ID will be generated for you.</li>
                                    <li className="text-column-item"><em>Hosts need a valid Spotify Premium account to log into.</em></li>
                                </ul>
                        </div>
                        <div className="text-column">
                            <strong>Guests - </strong>
                                <ul>
                                    <li className="text-column-item">Enter a valid party ID to join someone else's party.</li>
                                    <li className="text-column-item"><em>Guests DO NOT need a valid Spotify Premium account to join session.</em></li>
                                </ul>
                        </div>
                    </div>
                </ol>
                <h1>Disclaimers</h1>
                <ul>
                    <li>All song/queue interaction must be done on Groupify (do not use Spotify at the same time).</li>
                    <li>Due to the nature of Spotify’s API, Groupify cannot play a song if there is no current song playing. TO BEGIN: Have a song playing in Spotify. It will show up in your queue in Groupify, then you are ready to queue more songs.</li>
                </ul>
            </div>
        );
    } else {
        return (
            <div id="instruction-module" className="instruction-module">
                <h1>Instructions</h1>
                <ol>
                    <li>View your room code and party members using the navigation bar on the left.</li>
                    <li>The Host must start a song in Spotify to initialize the queue.</li>
                    <li>Search for songs using the form above and add them to the queue using the icon to the right of each resulting song.</li>
                    <li>See your queued songs and skip them using the “Queue” drawer in the bottom right corner. You can also view your song history from here.</li>
                    <li>Enjoy listening to music together using Groupify! To leave a party, open the user information navigation bar on the left and click “Leave Party”.</li>
                </ol>
                <h1>Disclaimers</h1>
                <ul>
                    <li>All song/queue interaction must be done on Groupify (do not use Spotify at the same time).</li>
                    <li>Due to the nature of Spotify’s API, Groupify cannot play a song if there is no current song playing. TO BEGIN: Have a song playing in Spotify. It will show up in your queue in Groupify, then you are ready to queue more songs.</li>
                </ul>
            </div>
        );
    }
}
import React from 'react';
import '../css/PartyPortal.css';

/**
 * Main component of the Party Portal page
 */
export default function PartyPortal(props) {
    return (
        <main className="container">
            <h1 id="banner">Groupify</h1>
                <form id="form-container">
                    <input 
                        id="party-id-field" 
                        name="party-id-field" 
                        type="text" 
                        placeholder="Enter a Party ID" />
                    <button id="submit-button" type="submit">
                        material icon goes here
                    </button>
                </form>
                <a href="#" id="new-party-link">START A NEW PARTY</a>
        </main>
    );
}
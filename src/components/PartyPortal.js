import React from 'react';
import '../css/PartyPortal.css';

/**
 * Main component of the Party Portal page
 */
export default function PartyPortal(props) {
    return (
        <main className="container">
            <div className="portal-content">
                <h1 id="banner">Groupify</h1>
                    <form id="form-container">
                        <input 
                            id="party-id-field" 
                            name="party-id-field" 
                            type="text" 
                            placeholder="Enter a Party ID" />
                        <label for="party-id-field" className="hidden">Input Party ID</label>
                        <button id="submit-button" type="submit">
                            material icon goes here
                        </button>
                        <label for="submit-button" className="hidden">submit</label>
                    </form>
                    <a href="#" id="new-party-link">START A NEW PARTY</a>
            </div>
        </main>
    );
}
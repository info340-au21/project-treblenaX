import React from 'react';
import SearchModule from './SearchModule.js'

/**
 * Main component of the Party Interface page
 */
export default function PartyInterface(props) {

    return (
        <div>
            <h1>PartyInterface</h1>
            <div>
                <SearchModule testSongData={ props.testSongData } />
            </div>
        </div>
    );
}
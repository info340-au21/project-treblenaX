import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export default function FooterModule() {
    return (
        <footer className="footer">Created with <FontAwesomeIcon icon={faHeart} /> by Elbert Cheng, Ryan Langford, Stephan Rubalcava, Alan Wen</footer>
    );
}
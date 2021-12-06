import { useLocation, Navigate } from "react-router";
import React from "react";

/**
 * Spotify authentication component handler
 * Receives the authentication response from Spotify and stores the access token on /auth
 */
export default function Auth(props) {
    // get token and state from url query params
    const location = useLocation();
    const query = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
    const code = query.get("code");
    const state = query.get("state");

    // get party id and username from state
    const partyId = state.split("-")[0];
    const username = state.split("-")[1];

    // TODO: Save user data to db

    // Redirect (Navigate, in React Router 6) to party page
    return (
        <Navigate to={`/party/${partyId}`} />
    );
}
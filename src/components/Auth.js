import {useLocation, Navigate} from 'react-router';
import React, {useEffect, useState} from 'react';
import {postAddUser} from './FirebaseHandler';
import Config from '../json/config.json';
import $ from 'jquery';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStroopwafel} from '@fortawesome/free-solid-svg-icons';

const spotifyApiTokenEndpoint = 'https://accounts.spotify.com/api/token';

/**
 * Spotify authentication component handler
 * Receives the authentication response from Spotify and stores the access token on /auth
 */
export default function Auth(props) {
  // States
  const [accessToken, setAccessToken] = useState();
  const [isLoading, setLoading] = useState(true);

  // get token and state from url query params
  const location = useLocation();
  const query = React.useMemo(() => new URLSearchParams(location.search), [location.search]);
  const code = query.get('code').toString('base64');
  const state = query.get('state');

  // get party id and username from state
  const partyId = state.split('-')[0];
  const username = state.split('-')[1];
  const isHost = state.split('-')[2];

  useEffect(() => {
    // request access token from spotify
    const client_id = Config.spotifyClientId;
    const client_secret = Config.spotifyClientSecret;
    const redirect_uri = Config.spotifyRedirectUri;
    const grant_type = 'authorization_code';
    const data = {
      client_id,
      client_secret,
      redirect_uri,
      grant_type,
      code,
    };

    // send request to spotify for authentication
    $.ajax({
      url: spotifyApiTokenEndpoint,
      type: 'POST',
      data: data,
      success: function(data) {
        // store access token and refresh token in firebase
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        setAccessToken(accessToken);

        // Start party session and add user
        const user = {
          username: username,
          host: (isHost === 'true'),
          accessToken: accessToken,
          refreshToken: refreshToken,
        };
        postAddUser(partyId, user);
        // loading is done
        setLoading(false);
      },
      error: function(data) {
        console.log(data);
      },
    });
  }, []);

  if (isLoading) {
    return (
      <div className="loading-page">
        <FontAwesomeIcon className="loading-icon fa-spin" icon={faStroopwafel} />
        <div className="loading-text">
          <h1>Redirecting...</h1>
        </div>
      </div>
    );
  }

  // Redirect (Navigate, in React Router 6) to party page
  return (
    <Navigate state={{
      partyId: `${partyId}`,
      username: `${username}`,
      accessToken: `${accessToken}`,
    }} to={`/party/${partyId}`} />
  );
}

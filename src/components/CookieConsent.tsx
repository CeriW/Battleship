import React, { useEffect } from 'react';
// @ts-ignore - type definitions may not be available
import CookieConsent from 'react-cookie-consent';
import { loadGoogleAnalytics, disableGoogleAnalytics } from '../utils/analytics';
import './CookieConsent.scss';

export const CookieConsentBanner: React.FC = () => {
  useEffect(() => {
    // Load GA if user previously accepted
    const consent = localStorage.getItem('CookieConsent');
    if (consent === 'true') {
      loadGoogleAnalytics();
    }
  }, []);

  return (
    <CookieConsent
      location="top"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="CookieConsent"
      cookieValue="true"
      declineCookieValue="false"
      expires={365}
      onAccept={loadGoogleAnalytics}
      onDecline={disableGoogleAnalytics}
      style={{
        background: 'rgb(18, 54, 76)',
        backdropFilter: 'blur(10px)',
        padding: '5px',
        fontSize: '1rem',
        fontFamily: "'Oswald', sans-serif",
        alignItems: 'center',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'row',
      }}
      buttonStyle={{
        background: '#ff6800',
        color: 'white',
        fontSize: '18px',
        fontFamily: "'Oswald', sans-serif",
        padding: '10px 25px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        textTransform: 'uppercase',
        fontWeight: 'medium',
        textShadow: '2px 2px 0 rgba(0, 0, 0, 0.5)',
        minHeight: '40px',
      }}
      declineButtonStyle={{
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        fontSize: '18px',
        fontFamily: "'Oswald', sans-serif",
        padding: '10px 25px',
        borderRadius: '5px',
        border: '2px solid white',
        cursor: 'pointer',
        textTransform: 'uppercase',
        fontWeight: 'medium',
        textShadow: '2px 2px 0 rgba(0, 0, 0, 0.5)',
        minHeight: '40px',
        marginRight: '10px',
      }}
    >
      <span style={{ marginRight: '20px', flex: '1 1 auto' }}>
        We use cookies to analyze website traffic and improve your experience.
      </span>
    </CookieConsent>
  );
};

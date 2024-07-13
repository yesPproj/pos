import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/Integration.css';


const RazorpayForm = () => {
    const [apiKey, setApiKey] = useState('');
    const [apiSecret, setApiSecret] = useState('');
    const [googleClientId, setGoogleClientId] = useState('');
    const [googleClientSecret, setGoogleClientSecret] = useState('');
    const [googleRedirectUri, setGoogleRedirectUri] = useState('');
    const [slackClientId, setSlackClientId] = useState('');
    const [slackClientSecret, setSlackClientSecret] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    const handleInstallClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsInstalled(true);
        }, 2000); // Simulate installation delay
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/save-credentials', {
                apiKey,
                apiSecret,
                googleClientId,
                googleClientSecret,
                googleRedirectUri,
                slackClientId,
                slackClientSecret,
            });
            if (response.data.success) {
                alert('Credentials saved successfully!');
            } else {
                alert('Failed to save credentials.');
            }
        } catch (error) {
            console.error('Error saving credentials:', error);
            alert('An error occurred while saving credentials.');
        }
    };

    const handleUninstallClick = async () => {
        try {
            const response = await axios.delete('/api/remove-credentials');
            if (response.data.success) {
                alert('Credentials removed successfully!');
                setIsInstalled(false);
                setApiKey('');
                setApiSecret('');
                setGoogleClientId('');
                setGoogleClientSecret('');
                setGoogleRedirectUri('');
                setSlackClientId('');
                setSlackClientSecret('');
            } else {
                alert('Failed to remove credentials.');
            }
        } catch (error) {
            console.error('Error removing credentials:', error);
            alert('An error occurred while removing credentials.');
        }
    };

    return (
        <div className="form-container">
            <img src="/razorpay-logo.png" alt="Razorpay Logo" />
            <h2>Install Integrations</h2>
            {!isInstalled && !isLoading && (
                <button onClick={handleInstallClick}>Install Integrations</button>
            )}
            {isLoading && <div className="loading-spinner"></div>}
            {isInstalled && (
                <>
                    <p className="install-message">Please provide your API credentials below:</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="apiKey">Razorpay API Key:</label>
                            <input
                                type="text"
                                id="apiKey"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="apiSecret">Razorpay API Secret:</label>
                            <input
                                type="text"
                                id="apiSecret"
                                value={apiSecret}
                                onChange={(e) => setApiSecret(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="googleClientId">Google Client ID:</label>
                            <input
                                type="text"
                                id="googleClientId"
                                value={googleClientId}
                                onChange={(e) => setGoogleClientId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="googleClientSecret">Google Client Secret:</label>
                            <input
                                type="text"
                                id="googleClientSecret"
                                value={googleClientSecret}
                                onChange={(e) => setGoogleClientSecret(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="googleRedirectUri">Google Redirect URI:</label>
                            <input
                                type="text"
                                id="googleRedirectUri"
                                value={googleRedirectUri}
                                onChange={(e) => setGoogleRedirectUri(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="slackClientId">Slack Client ID:</label>
                            <input
                                type="text"
                                id="slackClientId"
                                value={slackClientId}
                                onChange={(e) => setSlackClientId(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="slackClientSecret">Slack Client Secret:</label>
                            <input
                                type="text"
                                id="slackClientSecret"
                                value={slackClientSecret}
                                onChange={(e) => setSlackClientSecret(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Save Credentials</button>
                    </form>
                    <button onClick={handleUninstallClick} style={{ backgroundColor: '#ff4d4d', marginTop: '10px' }}>Uninstall Integrations</button>
                </>
            )}
        </div>
    );
};

export default RazorpayForm;

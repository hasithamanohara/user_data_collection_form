import React, { useState } from 'react';
import './App.css'; // Custom stylesheet

const App = () => {
    const [cuisine, setCuisine] = useState('');
    const [priceSensitivity, setPriceSensitivity] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [proximityWeight, setProximityWeight] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage({ text: '', type: '' });

        const formData = {
            cuisine,
            price_sense: priceSensitivity,
            lat: latitude,
            lon: longitude,
            prox_weight: proximityWeight,
        };

        try {
            const response = await fetch('http://localhost:5001/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage({ text: `Registration successful! User ID: ${result.user_id}`, type: 'success' });
                setCuisine('');
                setPriceSensitivity('');
                setLatitude('');
                setLongitude('');
                setProximityWeight('');
            } else {
                setMessage({ text: `Error: ${result.message || 'Something went wrong.'}`, type: 'error' });
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setMessage({ text: 'Network error or backend server is not running.', type: 'error' });
        }
    };

    return (
        <div className="container">
            <div className="form-wrapper">
                <h1 className="title">User Registration</h1>

                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label>
                        Preferred Cuisine:
                        <input
                            type="text"
                            value={cuisine}
                            onChange={(e) => setCuisine(e.target.value)}
                            placeholder="e.g., Italian, Mexican"
                            required
                        />
                    </label>

                    <label>
                        Price Sensitivity (1-5):
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={priceSensitivity}
                            onChange={(e) => setPriceSensitivity(e.target.value)}
                            required
                        />
                    </label>

                    <div className="lat-lon-group">
                        <label>
                            Latitude:
                            <input
                                type="number"
                                step="0.000001"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Longitude:
                            <input
                                type="number"
                                step="0.000001"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                required
                            />
                        </label>
                    </div>

                    <label>
                        Proximity Weight (0.0–1.0):
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="1"
                            value={proximityWeight}
                            onChange={(e) => setProximityWeight(e.target.value)}
                            required
                        />
                    </label>

                    <button type="submit">Register User</button>
                </form>
            </div>
        </div>
    );
};

export default App;

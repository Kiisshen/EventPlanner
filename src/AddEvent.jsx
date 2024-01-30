import { useState, useEffect } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './AddEvent.css'

function AddEvent(){
    const [eventName, setEventname] = useState('');
    const [eventDesc, setEventdesc] = useState('');

    const addEvent = async (event) => {
        event.preventDefault();
    
        try {
            const response = await fetch('http://localhost:5038/addEvent', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': document.cookie
                },
                body: JSON.stringify({
                  eventName,
                  eventDesc,
                }),
              });
    
            const data = await response.json();
    
            if (data.success) {
                console.log('Redirecting...');
                window.location.href = `/browseview.html`;
            } else {
                console.error('Server response error:', data);
                alert(`Error: ${JSON.stringify(data.error) || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred');
        }
    };

    return (
        <>
            <h2>Täytä tapahtuman tiedot!</h2>
            <form onSubmit={addEvent}>
                <input
                    type="text"
                    name="eventName"
                    placeholder="Tapahtuman nimi"
                    id="eventName"
                    value={eventName}
                    onChange={(e) => setEventname(e.target.value)}
                    required
                />
                <input
                    type="text"
                    name="eventDesc"
                    placeholder="Tapahtuman kuvaus"
                    id="eventDesc"
                    value={eventDesc}
                    onChange={(e) => setEventdesc(e.target.value)}
                    required
                />
                <input type="submit" value="Lisää" />
            </form>
        </>
    );
}

export default AddEvent;

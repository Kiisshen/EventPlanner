import { useState, useEffect } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './BrowseElement.css'

function BrowseElement(){
    const [events, setEvents] = useState([]);
    const [currentUser, setCurrentUser] = useState('')
    const [currentUserName, setCurrentUsername] = useState('')

    useEffect(() => {
        async function fetchEvents() {
            try {
                let response = await fetch('http://localhost:5038/getevents', {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': document.cookie
                    },
                });
                let eventsData = await response.json();
                setEvents(eventsData.events);
                setCurrentUser(eventsData.ownID);
                setCurrentUsername(eventsData.username);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }

        fetchEvents();
    }, []);

    async function addParticipant(event){
        const resp = await fetch('http://localhost:5038/addparticipant', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': document.cookie
            },
            body: JSON.stringify({
                eventID: event,
            }),
        });
        const data = await resp.json();
        if (data.success) {
            window.location.reload(true);
        }
    }

    async function deleteEvent(event){
        const resp = await fetch('http://localhost:5038/deleteevent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': document.cookie
            },
            body: JSON.stringify({
                eventID: event,
            }),
        });
        const data = await resp.json();
        if (data.success) {
            window.location.reload(true);
        }
    }

    async function removeParticipant(event){
        const resp = await fetch('http://localhost:5038/removeparticipant', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': document.cookie
            },
            body: JSON.stringify({
                eventID: event,
            }),
        });
        const data = await resp.json();
        if (data.success) {
            window.location.reload(true);
        }
    }

    return (
        <>
            <h2 className='eventsTitle'>Tulevat tapahtumat</h2>
            <hr></hr>
            <div className='eventCont'>
                {events.map((event, index) => (
                    <div className="event" key={index}>
                        <p>Tapahtuma: {event.eventName}</p>
                        <p>Järjestäjä: {event.eventOrganizerName}</p>
                        {event.participants.length > 0 ? (<p>Osallistujat: {event.participants.join(", ")}</p>) : (<p>Ei vielä osallistujia</p>)}
                        <p>Tapahtuman kuvaus: {event.eventDescription}</p>
                        {event.participants.includes(currentUserName) ? <button onClick={() => removeParticipant(event.eventID)}>Poista Ilmoittautuminen</button> : <button onClick={() => addParticipant(event.eventID)}>Ilmoittaudu</button>}
                        {currentUser == event.eventOrganizerID && (
                            <button onClick={() => deleteEvent(event.eventID)}>Poista tapahtuma</button>
                        )}
                    </div>
                ))}
            </div>
            <button onClick={() => {window.location.href=`/organize-event.html`}}>Järjestä Tapahtuma</button>
        </>
    );
}

export default BrowseElement;

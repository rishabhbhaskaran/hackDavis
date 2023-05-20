import React from 'react';
import { useState } from 'react';
import axios from "axios";
import { ReactDOM } from 'react-dom';
import { createRoot } from 'react-dom/client';
// import logo from './logo.svg';
// import './App.css';
function App() {

    // new line start
    const [profileData, setProfileData] = useState(null)

    function getData() {
        axios({
            method: "GET",
            url: "/getAgreggateMap",
        })
            .then((response) => {
                const res = response.data['pins'];
                console.log(res);
                setProfileData(({
                    lat: res[0].lat,
                    long: res[0].long
                }))
                console.log(res);
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
    }
    //end of new line 

    return (
        <div className="App">
            <header className="App-header">
                {/* <img src={logo} className="App-logo" alt="logo" /> */}
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>

                {/* new line start*/}
                <p>To get your profile details: </p><button onClick={getData}>Click me</button>
                {profileData && <div>
                    <p>Latitude: {profileData.lat}</p>
                    <p>Longitude: {profileData.long}</p>
                </div>
                }
                {/* end of new line */}
            </header>
        </div>
    );
}

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<App />);

export default App;
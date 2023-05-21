import React from 'react';
import { useState, useEffect } from 'react';
import axios from "axios";
import './yeti.min.css';
import { createRoot } from 'react-dom/client';
import DiscoverCity from './discover_city.js';
import CreateLayer from './create_layer.js';
import Visualize from './visualize.js';
import Browse from './browse.js';
import Map from './map.js';

import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';

function App() {
    const [topLevelState, setTopLevelState] = useState(true);
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<DiscoverCity />} />
                <Route path="/create_layer" element={<CreateLayer userId="abcd1234" />} />
                <Route path="/visualize" element={<Visualize userId="abcd1234" />} />
                <Route path="/browse" element={<Browse userId="abcd1234" topLevelState={topLevelState} setTopLevelState={setTopLevelState} />} />
                {/* <Route path="/viewMap" element={<ViewMap userId="abcd1234" topLevelState={topLevelState} setTopLevelState={setTopLevelState} />} /> */}
            </Routes>
        </Router>
    );
}

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<App />);

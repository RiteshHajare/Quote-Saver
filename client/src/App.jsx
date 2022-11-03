import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './components/Homepage';
import Login from './components/Login';

function App() {



    return (
        <div>
            <BrowserRouter >
                <Routes>
                    <Route exact path="/" element={<Login />} />
                    <Route exact path="/user" element={<Homepage />} />
                </Routes>
            </BrowserRouter>

        </div>
    )
}

export default App
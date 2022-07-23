import React from 'react';
import "./Home.css";
import Sidebar from "./Sidebar";
import Main from "./Main";
import Chatbox from './Chatbox';

const Home = ({socket, user}) => {
    return (
        <div className="home">
            {/* <div className="sidebar">
                <Sidebar />
            </div> */}
            <div className="main">
                <Main socket={socket} user={user} />
                <Chatbox socket={socket} user={user} chatAll={true} />
            </div>
        </div>
    )
}

export default Home

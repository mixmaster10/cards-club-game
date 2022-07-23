import React from 'react';
import "./Leaderboard.css";
import Sidebar from "./Sidebar";
import ScoreContent from "./ScoreContent";
import Chatbox from './Chatbox';

const Leaderboard = ({socket, user}) => {
    return (
        <div className="home">
            {/* <div className="sidebar">
                <Sidebar />
            </div> */}
            <div className="main">
                <ScoreContent socket={socket} user={user} />
                <Chatbox socket={socket} user={user} chatAll={true} />
            </div>
        </div>
    )
}

export default Leaderboard

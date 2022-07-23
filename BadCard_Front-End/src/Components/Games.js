import React from 'react';
import "./Games.css";
import Sidebar from "./Sidebar";
import Chatbox from './Chatbox';
import PlayGame from "./PlayGame";

const Games = ({socket, user}) => {
    return (
        <div className="playgame-data">
            {/* <div className="sidebar">
                <Sidebar />
            </div> */}
            <div className="main">
                <PlayGame socket={socket} user={user} />
                <Chatbox socket={socket} user={user} chatAll={false} />
            </div>
        </div>
    )
}

export default Games

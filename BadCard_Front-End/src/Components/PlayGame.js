import React, { useEffect, useReducer, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Game/Header';
import Judge from '../Game/Judge';
import Wait from '../Game/Wait';
import End from '../Game/End';
import Normal from '../Game/Normal';
import "./PlayGame.css";
import Buddy from "../assets/buddy.svg";

const PlayGame = ({socket, user}) => {

    const { id } = useParams();
    const [roomInfo, setRoomInfo] = useState({})
    const navigate = useNavigate();

    useEffect( () => {
        if(user) {
            socket.emit("room", {id : id})
            socket.on("room", (data) => {
                if(data) {
                    setRoomInfo(data);
                } else if(data === null) {
                    user.room = "";
                    navigate('/home', {user: user});
                }
            })
        }
    }, [socket, user] )
    
    useEffect( () => {
    }, [roomInfo]) 

    return (
        roomInfo 
        ?   <div className="playgame">
                <Header socket={socket} room={roomInfo} user={user} />
                <div className='buddy-container'>
                    <div className='buddy'>
                        <div className='budy-size'>
                            <div
                                className='budy-img'
                                    style={{
                                    backgroundImage: roomInfo.state == 0 ? 'url("' + require("../assets/buddy.svg").default + '")' : '',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                }}
                            >
                            </div>
                        </div>

                        {
                            roomInfo.state == 0 // waiting...
                            ? (<Wait socket={socket} room={roomInfo} user={user} />)
                            : (
                                roomInfo.state == 1 || roomInfo.state == 2 || roomInfo.state == 3// progressing
                                ? (
                                    user.wallet == roomInfo.judge.wallet  
                                    ? (<Judge socket={socket} room={roomInfo} user={user} />) // if you are a judge
                                    : (<Normal socket={socket} room={roomInfo} user={user} />) // you are normal player
                                )
                                : (
                                    roomInfo.state == 4 // end
                                    ? (<End socket={socket} room={roomInfo} user={user} />)
                                    : (<></>)
                                )
                            )
                        }
                    </div>
                </div>

            </div>
        :   <div className="playgame">
                <Header socket={socket} room={roomInfo} user={user} />
            </div>
    )
}

export default PlayGame

import { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';

const Wait = ({ socket, room, user }) => {

    const [disable, setDisable] = useState(false);
    const [time, setTime] = useState();
    const [min, setMin] = useState();
    const [startFlag, setStartFlag] = useState(false);
    let timer = 0;

    useEffect(() => {
        if(room && 
            user && 
            room.creator.wallet ==  user.wallet) {
            setDisable(true)
        }
    }, [socket])

    setInterval(myTimer, 1000);
    function myTimer() {
        timer ++;
        if(startFlag == false && timer == 600){
            socket.emit("quit", room);
            timer = 0;
        }
    }

    const onStart = () => {
        setStartFlag(true);
        socket.emit("start", room.id);
    }

    return (
        <div 
            style={{ 
                textAlign: 'center'
            }}
        >
            <div className="second">
                <span className="waiting-letter">
                    Waiting For Other Players To Join
                    <span className="dot first-dot">.</span>
                    <span className="dot second-dot">.</span>
                    <span className="dot third-dot">.</span>
                </span>
                <span className="user-name">
                    {( room && user && room.creator.wallet == user.wallet ) 
                        ?
                            <Button 
                                onClick={onStart}
                                size="lg"
                                disabled={room.users.length > 3 ? false: true}
                            >
                                Start the game
                            </Button>
                        : ""
                    }
                </span>
            </div>
            <div className="third" id="origin-third">
                <div className="cards">
                </div>
                <div className="third-data"></div>
            </div>
        </div>
    );
}

export default Wait;
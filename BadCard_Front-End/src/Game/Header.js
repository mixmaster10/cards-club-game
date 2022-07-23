import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import Modal from "react-modal";

const customStyles = {
    content: {
        width: "500px",
        top: "40%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

const Header = ({ socket, room, user }) => {
    const [modalIsOpenLeave, setIsOpenLeave] = useState(false);
    const [modalIsOpenQuit, setIsOpenQuit] = useState(false);
    let index = 0
    const navigate = useNavigate()
    const leaveTooltip = (props) => (
        <Tooltip 
            id="leave-tooltip"
            {...props}
        >
            Leave the room
        </Tooltip>
    );
    const cancelTooltip = (props) => (
        <Tooltip 
            id="cancel-tooltip"
            {...props}
        >
            Cancel the room
        </Tooltip>
    )

    const leave = () => {
        socket.emit("leave", {room: room, user: user})
        if(user.wallet == room.judge.wallet && room.state != 0 && room.users.length > 1) {
            socket.emit("next", { vote: [], room: room })
        }
        navigate('/home');
    }

    const quit = () => {
        socket.emit("quit", room);
    }

    function openModalLeave() {
        setIsOpenLeave(true);
    }

    function closeModalLeave() {
        setIsOpenLeave(false);
    }

    function openModalQuit() {
        setIsOpenQuit(true);
    }

    function closeModalQuit() {
        setIsOpenQuit(false);
    }
    
    return (
        <>
            <div className="first">
                <div className="game-name">
                    <div className='room-name'>{room.name}</div>
                    <div className="player-x">
                    { room.users
                        ?  room.users.map(e => 
                            
                                e.wallet == room.judge.wallet
                                ? 
                                    <div 
                                        className="player1" 
                                        key={index ++} 
                                    >
                                        <button
                                            style={{ 
                                                padding: '5px',
                                                backgroundColor: '#1a1a1a', 
                                                color: 'white'
                                            }}
                                        >
                                            <p style={{ marginBottom: 0, lineHeight: '1rem' }}>{e.username}</p>
                                            <p style={{ marginBottom: 0, lineHeight: '1rem', fontSize: '.75rem' }}>Bad Buddy</p>
                                        </button>
                                    </div>
                                :   <div 
                                        className="player1" 
                                        key={index ++} 
                                    >
                                        <button
                                            style={{ 
                                                padding: '5px',
                                                backgroundColor: 'white',
                                                color: 'black'
                                            }}
                                        >
                                            <p style={{ marginBottom: 0, lineHeight: '1rem' }}>{e.username}</p>
                                            <p style={{ marginBottom: 0, lineHeight: '1rem', fontSize: '.75rem' }}>{e.vote ? e.vote : 0} Points</p>
                                        </button>
                                    </div>
                                
                            )
                        :  ""
                    }
                    </div>
                </div>
                <div className="player-y">
                    <div className='user-name'>{user ? user.username : ""}</div>
                    <div 
                        style={{
                            paddingTop: '.5rem',
                            justifyContent: 'space-evenly',
                            display: 'flex',
                        }}
                    >
                        <OverlayTrigger
                            placement="left"
                            delay={{ show: 250, hide: 400 }}
                            overlay={leaveTooltip}
                        >
                            <Button variant="secondary" size="sm" onClick={openModalLeave}>
                                <i className="fas fa-external-link-alt"></i>
                            </Button>
                        </OverlayTrigger>
                        { room && user && room.state == 0 && user.wallet == room.creator.wallet || 
                        room && user && room.state == 4 && user.wallet == room.creator.wallet
                            ? 
                            <OverlayTrigger
                                placement="left"
                                delay={{ show: 250, hide: 400 }}
                                overlay={cancelTooltip}
                            >
                                <Button variant="secondary" size="sm" onClick={openModalQuit}>
                                    <i className="fas fa-times"></i>
                                </Button>
                            </OverlayTrigger>
                            : <></>
                        }
                        
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpenLeave}
                onRequestClose={closeModalLeave}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Example Modal"
            >
                <div className="modal-data-leave">
                    <div className="modal-text">
                        <span>Do you really want to leave the room?</span>
                    </div>
                    <div className='row'>
                        <div className="modal-data-btn col-6">
                            <button className="submit-btn" onClick={closeModalLeave}>NO</button>
                        </div>
                        <div className="modal-data-btn col-6">
                            <button className="submit-btn" onClick={leave}>YES</button>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modalIsOpenQuit}
                onRequestClose={closeModalQuit}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Example Modal"
            >
                <div className="modal-data-leave">
                    <div className="modal-text">
                        <span>Do you really want to end the game?</span>
                    </div>
                    <div className='row'>
                        <div className="modal-data-btn col-6">
                            <button className="submit-btn" onClick={closeModalQuit}>NO</button>
                        </div>
                        <div className="modal-data-btn col-6">
                            <button className="submit-btn" onClick={quit}>YES</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default Header;
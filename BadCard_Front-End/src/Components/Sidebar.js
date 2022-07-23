import React, {useState, useEffect} from 'react';
import "./Sidebar.css";
import Modal from "react-modal";
import Logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useEthers } from "@usedapp/core";
import discord_img from '../assets/discord.svg';
import { Button, Form, InputGroup, FormControl } from 'react-bootstrap';

const customStyles_leave = {
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
const customStyles = {
    content: {
        width: "500px",
        top: "40%",
        left: "56%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
  };

const Sidebar = ({socket, user}) => {
    const [modalIsOpenLeave, setIsOpenLeave] = useState(false);
    const [router, setRouter] = useState('');
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalDataOpen, setModelDataOpen] = useState(false);
    const { account, deactivate } = useEthers();
    const [username, setUsername] = useState("");
    const [pack, setPack] = useState(1);
    const [password, setPassword] = useState("");
    const [roomname, setRoomName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(user) {
            setUsername(user.username);
        } else {
            handleDisconnect()
        }
    }, [user])

    useEffect( () => {
    }, [username, roomname])

    function openModal() {
      setIsOpen(true);
    }
  
    function closeModal() {
      setIsOpen(false);
    }

    function openModalLeave(_router) {
        if(user.room){
            setIsOpenLeave(true);
            setRouter(_router);
        }else {
            if(_router == 'logout')
                handleDisconnect();
            else
                navigate(_router);
        }
        
    }

    function closeModalLeave() {
        setIsOpenLeave(false);
    }

    function newGame() {
        setModelDataOpen(true);
    }

    function closeDataModal() {
        setModelDataOpen(false);
    }

    function handleDisconnect() {
        deactivate();
        socket.emit("logout");
        navigate('/');
    }

    const changeUsername = (e) => {
        setUsername(e.target.value);
    }

    const changeRoomname = (e) => {
        setRoomName(e.target.value)
    }

    const changePack = (e) => {
        const value = e.target.value
        setPack(value)
    }

    const changePassword = (e) => {
        setPassword(e.target.value)
    }

    const changePasswordShow = () => {
        setShowPassword(!showPassword);
    }

    const handleSettings = (e) => {
        socket.emit("addUser", {
            username : username,
            wallet : account,
        })
        closeModal()
    }

    const handleCreateRoom = (e) => {
        socket.emit("createRoom", {
            wallet : account,
            roomname : roomname,
            password: password,
            pack: pack
        })
        closeDataModal()
        socket.on('userInfo', data => {
            if(data && data.wallet == account && data.room != "") {
                navigate('/playgame/' + data.room)
            } 
        })
    }

    const leave = () => {
        if(router == 'logout'){
            handleDisconnect();
        }else {
            if(user.room) {
                socket.emit("room", {id : user.room})
                socket.on("room", (room) => {
                    socket.emit("leave", {room: room, user: user})
                    if(user.wallet == room.judge.wallet && room.state != 0 && room.users.length > 1) {
                        socket.emit("next", { vote: [], room: room })
                    }
                });
            }
            navigate(router);
            setIsOpenLeave(false);
        }

    }

    return (
        <div className="sidebar-menu">
            <div className="sidebar-logo-area">
                <div className="sidebar-logo">
                    <img src={Logo} alt="logo" />
                </div>
                <div className="sidebar-logo-btn">
                    <button>{ String(account).substring(0, 4) + ".." + String(account).substring(39)}</button>
                </div>
            </div>
            <div className="sidebar-menu-items">
                <div className="sidebar-menu-item">
                    <a onClick={ () => openModalLeave('logout') } style={{display : "flex", gap : "10px"}}>
                        <span><i className="fa fa-home"></i></span>
                        <span className="sidebar-menu-item-label">Home</span>
                    </a>
                </div>
                <div className="sidebar-menu-item">
                    <a onClick={ () => openModalLeave('/home') } style={{display : "flex", gap : "10px"}}>
                        <span><i className="fa fa-user"></i></span>
                        <span className="sidebar-menu-item-label">Games</span>
                    </a>
                </div>
                <div className="sidebar-menu-item">
                    <a href="https://discord.com" target="_blank" style={{display : "flex", gap : "7px"}}>
                        <span><img className='discord-img' src={discord_img}></img></span>
                        {/* <span><i className="fa fa-discord"></i></span> */}
                        <span className="sidebar-menu-item-label">Discord</span>
                    </a>
                </div>
                <div className="sidebar-menu-item">
                    <a href="#" onClick={openModal} style={{display : "flex", gap : "10px"}}>
                        <span><i className="fa fa-gear"></i></span>
                        <span className="sidebar-menu-item-label">Settings</span>
                    </a>
                </div>
                <div className="sidebar-menu-item">
                    <a onClick={ () => openModalLeave('/leader-board') } style={{display : "flex", gap : "10px"}}>
                        <span><i className="fa fa-table"></i></span>
                        <span className="sidebar-menu-item-label">Leader Board</span>
                    </a>
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    ariaHideApp={false}
                    contentLabel="Example Modal"
                >
                    <div className="modal-data">
                        <div className="modal-text">
                            <span>Settings</span>
                        </div>
                        <form onSubmit={ handleSettings }>
                            <div className='row'>
                                <div className='setting-label col-sm-6 col-6'>
                                    <div>Discord Name:</div>
                                    {/* <div>Discord</div> */}
                                    <div>Twitter Handle:</div>
                                </div>
                                <div className='col-sm-6 col-6'>
                                    <div><input type="text" onChange={ changeUsername } defaultValue={username} /></div>
                                    {/* <div><input type="text" /></div> */}
                                    <div><input type="text" /></div>
                                </div>
                            </div>
                            <div className="modal-data-btn">
                                <button className="submit-btn submit-btn-cancel" onClick={ closeDataModal }>Cancel</button>
                                <button type="submit" className="submit-btn">Enter</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
            <div className="sidebar-menu-item">
                <Button 
                    onClick={newGame} 
                    disabled={user ? (user.room ? true : false) : false}
                >
                    <i className="fa fa-plus"></i>
                    <span className="sidebar-menu-item-label">&nbsp;Create New Game</span>
                </Button>
                <Modal
                    isOpen={modalIsOpenLeave}
                    onRequestClose={closeModalLeave}
                    style={customStyles_leave}
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
                    isOpen={modalDataOpen}
                    onRequestClose={closeDataModal}
                    style={customStyles}
                    ariaHideApp={false}
                    contentLabel="Example Modal"
                >
                    <div className="modal-game-data">
                        <div className="modal-text create-modal-title">
                            <span>Create New Game</span>
                        </div>
                        <Form onSubmit={handleCreateRoom}>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Game Name</Form.Label>
                                <Form.Control type="text" placeholder="" value={roomname} onChange={changeRoomname} required={true} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <InputGroup className="mb-3">
                                    <FormControl
                                    placeholder="Password"
                                    aria-label="Password"
                                    aria-describedby="basic-addon2"
                                    type={ pack == 1 ? "password" : (showPassword ? 'text' : 'password')}
                                    disabled={pack == 1 ? true: false} required={pack == 2 ? true : false} value={password} onChange={changePassword}
                                    />
                                    <InputGroup.Text id="basic-addon2" onClick={pack == 1 ? null :changePasswordShow} style={{cursor: "pointer"}}>
                                        {
                                            pack == 1 
                                            ? <i className="fa fa-eye"></i>
                                            : (
                                                showPassword 
                                                ? <i className="fa fa-eye-slash"></i> 
                                                : <i className="fa fa-eye"></i>
                                            )
                                        }
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Packs</Form.Label>
                                <div style={{display: 'flex'}}>
                                    <Form.Check type="radio" label="Starter Pack" name="pack" checked={pack == 1 ? true : false} value={1} onChange={changePack} style={{display: 'inline-block'}} />
                                    <Form.Check type="radio" label="Expansion X" name="pack" checked={pack == 2 ? true : false} value={2} onChange={changePack} style={{display: 'inline-block', marginLeft: 'auto'}} />
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-3" style={{ textAlign: 'center' }}>
                                <div className="modal-data-btn">
                                    <Button className="submit-btn submit-btn-cancel" onClick={closeDataModal}>Cancel</Button>
                                    <Button variant="dark" type="submit" className='submit-btn'>Enter</Button>
                                </div>
                            </Form.Group>
                        </Form>
                    </div>
                </Modal>
            </div>
            <div className="sidebar-menu-item sidebar-menu-disconnect-area">
                <a onClick={ () => openModalLeave('logout') } style={{display : "flex", gap : "10px"}}>
                    <span><i className="fa fa-power-off"></i></span>
                    <span className="sidebar-menu-item-label"> Disconnect</span>
                </a>
            </div>
        </div>
    )
}

export default Sidebar

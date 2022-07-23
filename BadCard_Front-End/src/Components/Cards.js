import React, { useEffect, useState } from "react";
import Logo from "../assets/Group.png";
import Modal from "react-modal";
import { useEthers } from "@usedapp/core";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Cards = ({room, socket}) => {

  const { account } = useEthers();
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [errorShow, setErrorShow] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  }

  const changePassword = (e) => {
    setPassword(e.target.value);
    setErrorShow(false)
  }

  const handlePreJoin = () => {
    if(room.pack == 2) {
      setIsOpen(true);
    } else {
      handleJoin();
    }
  }

  const handleJoin = (e) => {
    if(room.pack == 2) {
      e.preventDefault();
      if(password == room.password) {
        socket.emit("join", { wallet: account, roomID: room.id, isApprove: true });
        navigate('/playgame/' + room.id);  
      } else {
        setErrorShow(true);
      }
    } else {
      socket.emit("join", { wallet: account, roomID: room.id, isApprove: true });
      navigate('/playgame/' + room.id);
    }
  }

  return (
    <>
      <div className="main-cards">
        <div className="main-card-item">
          <div className="main-card-item-text">
            <span>{room.name}</span>
            <span>Players : {room.users.length}</span>
            <span>Private? {room.pack == 2 ? 'Yes' : 'No'}</span>
          </div>
          <div className="main-card-bottom">
            {!room.users.find(e => e.wallet == account) && room.state == 0
              ? (<button onClick={ handlePreJoin }>Join</button>)
              : ""
            }
            <span>
                <img src={Logo} className="logo" alt="smiley" />
            </span>
          </div>
        </div>
      </div>
      <Modal
          isOpen={modalIsOpen}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
          onRequestClose={closeModal}
          style={customStyles}
          ariaHideApp={false}
          contentLabel="Enter password"
      >
          <button className="modal-close" onClick={closeModal}>X</button>
          <div className="modal-game-data">
            <div className="modal-text">
                <span>Enter Password To Join To The Game</span>
            </div>
            <Form onSubmit={handleJoin}>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={changePassword} required={true} />
                {errorShow 
                  ? <Form.Text className="text-muted">
                      Password Is Incorrect.
                    </Form.Text>
                  : <></>
                }
              </Form.Group>
              <Form.Group className="mb-3">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form.Group>
            </Form>
          </div>
      </Modal>
    </>
  );
};

export default Cards;

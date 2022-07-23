import React, { useEffect, useRef, useState } from 'react';
import "./Chatbox.css";
import Person from "../assets/person.jpg";
import Logo from "../assets/logo.png";

const Chatbox = ({socket, chatAll, user}) => {
    const [chats, setChats] = useState([]);
    const [content, setContent] = useState("");

    const contentRef = useRef(null)
    let chatContents = []

    useEffect( () => {
        let index = 0
        socket.on("chat", (data) => {
            chatContents.push(data)
            console.log('chatContents', chatContents)
            const contents = chatContents.map((element) => 
                <div className="chatbox-details" key={ index ++ }>
                    <div className="person-image">
                        {/* <img src={Logo} alt="person-image" /> */}
                        <div className='chat-avatar'>{element.user.username}</div>
                    </div>
                    <div className="chatbox-text">
                        <span>{element.content}</span>
                    </div>
                </div>
            )

            setChats(contents)
        })
    }, [socket]);

    const onSend = () => {
        if(content === "") {
            contentRef.current.style.border = '1px solid red';
        } else {
            socket.emit("chat", {
                user : user,
                content: content,
                chatAll: chatAll
            })
        }

        setContent("");
    }

    const changeContent = (e) => {
        if(e.target.value) {
            contentRef.current.style.border = '1px solid #999';
        }
        setContent(e.target.value);
    }

    const divRref = useRef(null);

    useEffect(() => {
        divRref.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    });

    return (
        <div className="chatbox">
            <div className="chatbox-title">
                <span>GAME CHAT</span>
            </div>
            <div className="chatbox-data">
                {chats}
                {/* <div className="chatbox-details">
                    <div className="person-image">
                        <img src={Logo} alt="person-image" />
                    </div>
                    <div className="chatbox-text">
                        <span>that was a great card!</span>
                    </div>
                </div>
                <div className="chatbox-details">
                    <div className="person-image">
                        <img src={Person} alt="person-image" />
                    </div>
                    <div className="chatbox-text">
                        <span>Tysm!</span>
                    </div>
                </div> */}
                <div ref={divRref} />
            </div>
            <div className="chatbox-send">
                <div className="content">
                    <input type="text" ref={contentRef} value={content} onChange={changeContent} 
                        onKeyPress={(event) => {
                            if (event.key === "Enter") {
                                onSend();
                            }
                        }}
                    />
                </div>
                <div className="send">
                    <button type="button" className="submit-btn" onClick={onSend}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chatbox
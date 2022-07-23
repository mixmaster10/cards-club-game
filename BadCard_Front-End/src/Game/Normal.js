import { useState, useEffect } from "react";

const Normal = ({ socket, room, user }) => {
    const [content, setContent] = useState({});
    const [card, setCard] = useState(null);
    const [voteInfo, setVoteInfo] = useState([])
    const [timer, setTimer] = useState(60);

    let index = 0
    let i = 0

    useEffect(() => {
        setCard(null)
        const quizs = document.getElementsByClassName('quiz-card')
        for(let quiz of quizs) {
            quiz.style.display = 'block';
        }
        socket.on("content", data => {
            setContent(data);
        })
        socket.on("result", data => {
            setVoteInfo(data)
        })
        socket.on("timer", timer => setTimer(timer))
    }, [socket, room.turn])

    const onPick = (e) => {
        const text = e.currentTarget.getElementsByTagName('p')[0].textContent
        const selCard = 
            <>
                <div className="second">
                    <h1 style={{ paddingLeft: '20px' }}>Selected Card:</h1>
                </div>
                <div className="third">
                    <div className="third-data">
                        <div className="third-data1">
                            <p>
                                {text}
                            </p>
                        </div>
                    </div>
                </div>
            </>
        
        if(!card) {
            e.currentTarget.style.display = 'none'
            setCard(selCard)
            socket.emit("pick", {
                room: room,
                user: user, 
                text: text
            })
        }
    }
    return (
        <>
            <div className="second" style={{ flexDirection: 'row' }}>
                <div style={{ maxWidth: 'calc(100% - 175 px)', paddingLeft: '20px', paddingBottom: '1rem'}}>
                    <h1>Question</h1>
                    <h3>{content.question}</h3>
                </div>
                <div className="game-info">
                    <div className="submission">
                        <h5>{room.pick.length} / {room.users.length - 1} </h5>
                        <h5>Submitted</h5>
                    </div>
                    <div className="timer">
                        <h5>Timer: {timer}</h5>
                    </div>
                </div>
            </div>
            {
                room.state == 1 
                ? (
                    <>
                        {card}
                        <div className="third" id="origin-third">
                            <div className="cards" style={{display: 'block', marginLeft: 0}}>
                                <h1>Your Cards :</h1>
                            </div>
                            <div className="third-data">
                            {
                                content.content
                                ?   content.content.map(e => 
                                        <div 
                                            className="third-data1 quiz-card" 
                                            onDoubleClick={onPick} 
                                            key={index ++ } 
                                            style={{ 
                                                cursor: 'pointer',
                                                backgroundColor: 'white'
                                            }}
                                        >
                                            <p>{e}</p>
                                        </div>
                                    )
                                :   ("")
                            }
                            </div>
                        </div>
                    </>
                ) : (
                    room.state == 2 
                    ? (
                        <>
                            <div className="second">
                                <h1 style={{ paddingLeft: '1.25rem' }}>
                                    Bad Buddy Is Selecting
                                    <span className="dot first-dot">.</span>
                                    <span className="dot second-dot">.</span>
                                    <span className="dot third-dot">.</span>
                                </h1>
                            </div>
                            <div className="third-data">
                            {   room.pick 
                                ?   room.pick.map(e => 
                                        <div 
                                            className="third-data1"
                                            key={i ++ } 
                                        >
                                            <p>{e.text}</p>
                                        </div>
                                    )
                                :   <></>
                            }
                            </div>
                        </>
                    ) : (
                        room.state == 3
                        ? (
                            voteInfo.length
                            ? (
                                <>
                                    <div className="second">
                                        <h1 style={{ paddingLeft: '1.25rem' }}>
                                        {
                                            (voteInfo.map(e => 
                                                (room.users.find(ele => ele.wallet == e) 
                                                ?   (room.users.find(ele => ele.wallet == e).username + ' ')
                                                :   'Nobody '
                                            )).toString())
                                        } Wins!</h1>
                                        <div className="third-data">
                                        {
                                            voteInfo.map(e => {
                                                let j = 0;
                                                return (
                                                    <>
                                                        <div 
                                                            className="third-data1"
                                                            key={j ++}
                                                        >
                                                            <p>
                                                                {
                                                                    room.pick.find(ele => ele.user.wallet == e) 
                                                                    ?   room.pick.find(ele => ele.user.wallet == e).text
                                                                    :   ''                                                                
                                                                }
                                                            </p>
                                                        </div>
                                                    </>
                                                )
                                            })
                                        }
                                        </div>
                                    </div>
                                </>
                            )
                            : (
                                <div className="second">
                                    <h1 style={{paddingLeft: '1.25rem'}}>No Winner!</h1>
                                </div>
                            )
                        ) : (
                            <></>
                        )

                    )
                )
            }
            
       </>
    );
}

export default Normal;
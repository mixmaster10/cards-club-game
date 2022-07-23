import { useState, useEffect } from "react";

const Judge = ({ socket, room, user }) => {

    const [content, setContent] = useState({});
    const [voteInfo, setVoteInfo] = useState([]);
    const [timer, setTimer] = useState(60);

    let index = 0;
    let i = 0;

    useEffect( () => {
        if(room.id) {
            socket.emit("content", room.id)
            socket.on("content", data => {
                setContent(data);
            })
            socket.on("result", data => {
                setVoteInfo(data)
            })
            socket.on("timer", time => setTimer(time))
        }
    }, [socket, room.turn])

    const confirm = () => {
        socket.emit("next", { vote: voteInfo, room: room });
    }

    const vote = (e) => {
        console.log(e.target.checked)
        console.log(e.target.value)
        const checked = e.target.checked;
        const value = e.target.value;

        if(checked) {
            const isExist = voteInfo.find(e => e == value)
            if(!isExist) {
                voteInfo[0] = value
            }
        } else {
            const isExist = voteInfo.find(e => e == value)
            if(isExist) {
                const index = voteInfo.findIndex(e => e == value)
                voteInfo.splice(index, 1)
            }
        }
        setVoteInfo(voteInfo)
    }
    return (
        <>
            <div className="second" style={{ color: 'white', paddingLeft: '20px', flexDirection: 'row', paddingBottom: '1rem' }}>
                <div style={{ maxWidth: 'calc(100% - 175px)'}}>
                    <h1 style={{marginLeft: 0}}>Question</h1>
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
                    <div 
                        style={{
                            textAlign: 'center',
                            position: 'relative',
                            marginTop: 'auto',
                            marginBottom: 'auto',
                            color: 'white',
                            backgroundImage: 'url("' + require("../assets/buddy.svg").default + '")',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: '100% 100%',
                        }}
                    >
                        <div 
                            style={{
                                display: 'inline-block',
                                padding: '1rem'
                            }}
                        >
                            <h5>You Are The Bad Buddy</h5>
                            <h6>(Waiting For Players To Submit Cards)</h6>
                        </div>
                    </div>
                ) : (
                    room.state == 2
                    ? (
                        <>
                            <div 
                                className="second"
                                style={{ 
                                    flexDirection: 'initial',
                                    paddingLeft: '1rem',
                                    paddingRight: '1rem'
                                }}
                            >
                                <h1 style={{ display: 'inline-block'}}>Select The Winner</h1>
                                <button 
                                    className="sidebar-menu-item-btn" 
                                    style={{ 
                                        display: 'inline-block', 
                                        marginLeft: 'auto',
                                        marginTop: 'auto',
                                        marginBottom: 'auto'
                                    }} 
                                    onClick={confirm}
                                >
                                    Confirm
                                </button>
                            </div>
                            <div className="third-data">
                            {   room.pick 
                                ?   room.pick.map(e => 
                                        <>
                                            <div 
                                                className="third-data1"
                                                style={{ height: 'calc(200px + 2.5rem)'}}
                                                key={i ++ } 
                                            >
                                                <div 
                                                    style={{ 
                                                        padding: '1rem',
                                                        display: 'flex',
                                                        fontSize: '1.5rem',
                                                        fontWeight: 500,
                                                        paddingBottom: 0,
                                                    }}> 
                                                    <input 
                                                        type="radio" 
                                                        name="group"
                                                        disabled={(room.pick.length == room.users.length - 1) ? false: true}
                                                        value={e.user.wallet}
                                                        onChange={vote}
                                                        style={{
                                                            marginTop: 'auto',
                                                            marginBottom: 'auto',
                                                            marginLeft: 'auto',
                                                            marginRight: 'auto',
                                                            width: '1.5rem',
                                                            height: '1.5rem'
                                                        }}
                                                    />
                                                </div>
                                                <p style={{ height: 'initial'}}>{e.text}</p>
                                            </div>
                                        </>
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
                                        } Wins!
                                        </h1>
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
                                                                    room.pick.find(ele => ele.user.wallet == e).text
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
                                    <h1 style={{ paddingLeft: '1.25rem' }}>No Winner!</h1>
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

export default Judge;
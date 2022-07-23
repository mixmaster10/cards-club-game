import { useState, useEffect } from "react";

const End = ({ socket, room, user }) => {
    const [championStrs, setWinnerStr] = useState("")
    const [champions, setWinner] = useState([])
    useEffect(() => {
        const winners = room.users.filter(e => e.vote > 4)
        const winnersStr = winners.map(e => e.username + ' ').toString()

        setWinner(winners)
        setWinnerStr(winnersStr)
    }, [room])
    return (
        <>
            <div 
                style={{
                    textAlign: 'center',
                    position: 'relative',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                    color: 'white',
                }}
            >
                <div 
                    style={{
                        display: 'inline-block',
                        padding: '1rem'
                    }}
                >
                    {
                        (champions.length > 1) 
                        ? (<h1>{championStrs} Are Winners In This Game!</h1>)
                        : (<h1>{championStrs} Is Winner In This Game!</h1>)
                    }
                </div>
            </div>
        </>
    );
}

export default End;
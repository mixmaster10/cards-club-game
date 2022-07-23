import React, { useState, useEffect } from "react";
import "./ScoreContent.css";
import Cards from "./Cards";
import Logo from "../assets/First_log.png";

const ScoreContent = ({ socket, user }) => {

  const [openRooms, setOpenRooms] = useState([])
  const [userScoreInfo, setUserScoreInfo] = useState([])
  const [scoreData, setScoreData] = useState([])


  useEffect(() => {
    socket.emit("rooms");
    socket.on("rooms", (data) => {
      let i = 0 
      const rooms = data.map((element) => {
        i ++;
        return <Cards key={i} room={element} socket={socket}/>
      })

      setOpenRooms(rooms)
    })

    socket.emit("userScoreInfo", {})
    socket.on("userScoreInfo", dataScore => {
      if(dataScore) {
        console.log("userScoreInfo", dataScore)
        setUserScoreInfo(dataScore)
      }
    })
  }, [socket])

  useEffect(() => {
    let tmptbl = "";
    userScoreInfo.forEach(async oneData => {
      tmptbl += "<tr>";
        tmptbl += "<td>";
          tmptbl += oneData.wallet;
        tmptbl += "</td>";
        tmptbl += "<td>";
          tmptbl += oneData.username;
        tmptbl += "</td>";
        tmptbl += "<td>";
          tmptbl += oneData.score ? oneData.score : 0;
        tmptbl += "</td>";
      tmptbl += "</tr>";
    });
    
    setScoreData(tmptbl);

  }, [userScoreInfo])

  return (
    <React.Fragment>
      <div className="main-data">
        <div className="score-logo">
            <img src={Logo} alt="logo" />
        </div>
        <div className="main-heading-score">
          <span>Leader Board:</span>
        </div>
        <div className="cards scroll-container">
          <table className="text-white score-tbl">
            <thead>
              <th>Wallet Address</th>
              <th>Discord Name</th>
              <th>Score</th>
            </thead>
            <tbody dangerouslySetInnerHTML={{__html: scoreData}}>
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ScoreContent;

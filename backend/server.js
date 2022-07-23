const express   = require('express');
const cors      = require('cors');
const http      = require('http');   
const app       = express();
const MongoClient =  require('mongodb').MongoClient;

const db_url = "mongodb://localhost:27017/mydb"

app.use(cors());

const server = http.createServer(app);
server.listen(process.env.PORT || 8000);

// create socket.io server and bind it to the existing http server
const io    = require('socket.io')(server);
const User  = require('./app/user');
const Room  = require('./app/room');
const contents = require('./contents/card.json');

let rooms = []
let users = []

const getOneCardContent = () => {
    
    const quesNo    = Math.ceil(Math.random() * contents.blackCards.length - 1)
    const question  = contents.blackCards[quesNo]['text']

    let content = []

    for(let i = 0; i < 5; i ++) {
        const contNo    = Math.ceil(Math.random() * contents.whiteCards.length - 1);
        const con       = contents.whiteCards[contNo]

        content.push(con)
    }

    return { question: question, content: content }
}

const createRoom = (wallet, roomname, password, pack, timer) => {
    const user = users.find(e => e.wallet === wallet)
    if(user) {
        user.isApprove = true;
        const id = Date.now()
        const newRoom =  new Room(
            id, 
            roomname, 
            [user], 
            user,
            0,
            [],
            user,
            1,
            password, 
            pack,
            timer
        )
        rooms.push(newRoom)
        user.setRoom(id);

        return {newRoom: newRoom, user: user}
    } else {
        return false;
    }
}

const addUser = async (username, wallet, socket) => {
    const user = users.find((user) => user.wallet == wallet);
    if(user) {
        if(socket.id == user.socket) {
            user.wallet = wallet;
            user.username = username;

            const db    = await MongoClient.connect(db_url);
            const dbo   = db.db("card");
            const query = { wallet: wallet }
            const newValue = { $set: user }

            await dbo.collection("users").updateOne( query, newValue)

            return user
        } else {
            disconnect(socket)
            return false;
        }
    } else {
        let newOne = new User(
            wallet, 
            'Player ' + (users.length + 1), 
            false,
            false,
            "",
            false,
            socket.id,
            0
        )
        const db    = await MongoClient.connect(db_url);
        const dbo   = db.db("card");
        const query = { wallet: newOne.wallet }

        const result = await dbo.collection("users").findOne(query)
        if(result) {
            newOne.username = result.username
        } else {
            await dbo.collection("users").insertOne(newOne);
        }
        db.close()

        users.push(newOne)
        return newOne
    }
}

const sendRoomsInfo = () => {
    let sendRooms = []

    for( let room of rooms ) {
        const sendData = { ...room };
        delete sendData.timerContainer;
        delete sendData.timerOutContainer;

        sendRooms.push( sendData )
    }

    io.emit( "rooms", sendRooms );
}


const leaveRoom = (socketInfo, data) => {
   
    let room      = rooms.find(e => e.id == data.room.id)
    const userId    = room.users.findIndex(e => e.wallet == data.user.wallet)
    const userPickID = room.pick.findIndex(e => e.user.wallet == data.user.wallet)

    let user  = users.find(e => e.wallet == data.user.wallet);
    user.room   = "";
    user.isPart = false;

    if(userPickID !== -1) {
        room.pick.splice(userPickID, 1)
    }

    if(userId !== -1) {
        room.users.splice(userId, 1)
    }

    socketInfo.leave(room.id);

    if(room.users.length == 0) {
        const roomIndex = rooms.findIndex(e => e.id ==  room.id);
        if(roomIndex > -1) {
            rooms.splice(roomIndex, 1);
        }
        clearInterval(room.timerContainer);
        clearTimeout(room.timerOutContainer);
        io.to(room.id).emit("room", null);
    } else {
        const sendData = { ...room };
        delete sendData.timerContainer;
        delete sendData.timerOutContainer;

        io.to(room.id).emit( "room", sendData );
    }

    sendRoomsInfo();
    socketInfo.emit("userInfo", user)
}

const disconnect = (socketInfo) => {
    if(users.length) {
        const userIndex = users.findIndex(e => e.socket == socketInfo.id);
        const user = users.find(e => e.socket == socketInfo.id);

        if(user) {
            const room = rooms.find(e => e.id == user.room)

            if(user && room) {
                leaveRoom(socketInfo, {
                    user: user,
                    room: room
                })
            }
            users.splice(userIndex, 1);
        }
    }
}

    // if(userIndex > -1) {

    //     user == users.
    //     for(let room of rooms) {
            // const roomUserIndex = room.users.findIndex(ele => ele.socket == socketInfo.id)
            // if(roomUserIndex > -1) {
            //     room.users.splice(roomUserIndex, 1);
            // }
            // if(room.users.length == 0) {
            //     const roomIndex = rooms.findIndex(e => e.id ==  room.id);
            //     if(roomIndex > -1) {
            //         rooms.splice(roomIndex, 1);
            //     }
            //     clearInterval(room.timerContainer);
            //     clearTimeout(room.timerOutContainer);

            //     io.to(room.id).emit("room", null);
            //     sendRoomsInfo();

            // } else {

            //     const sendData = { ...room };
            //     delete sendData.timerContainer;
            //     delete sendData.timerOutContainer;

            //     io.to(room.id).emit( "room", sendData );
            // }
        // }
    // }
// }

io.sockets.on("connection", function (socket) {

    socket.on("rooms", () => {
        sendRoomsInfo();
    })

    socket.on("room", (data) => {
        const room      =  rooms.find(e => e.id == data.id)
        const sendData  = { ...room };

        delete sendData.timerContainer;
        delete sendData.timerOutContainer;

        socket.emit("room", sendData)
    })
    
    socket.on("createRoom", (data) => {
        const info = createRoom(data.wallet, data.roomname, data.password, data.pack, 60)
        if(info) {
            socket.join(info.newRoom.id)
        }
        socket.emit("userInfo", info.user)
        sendRoomsInfo();
    })

    socket.on("addUser", async (data) => {
        const newUser = await addUser(data.username, data.wallet, socket)
        socket.emit("userInfo", newUser)
    }) 

    socket.on("chat", (data) => {
        if(data.chatAll) {
            io.emit("chat", data)
        } else {
            if(data.user) {
                const room = rooms.find(e => e.id == data.user.room)

                if(room) {
                    io.to(room.id).emit("chat", data)
                }
            }
            
        }
    })

    socket.on("userInfo", (data) => {
        const user = users.find( e => e.wallet === data.wallet)
        socket.emit("userInfo", user)
    })

    socket.on("userScoreInfo", () => {
        MongoClient.connect(db_url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("card");
            dbo.collection("users").find({}).toArray(function(err, result) {
              if (err) throw err;
              socket.emit("userScoreInfo", result);
              db.close();
            });
        });
    })

    socket.on("join", (data) => {

        const room = rooms.find(e => e.id == data.roomID)
        const user = users.find(e => e.wallet == data.wallet)

        if(user && room) {
            user.isApprove = data.isApprove;
            room.accept(user);
            user.setRoom(room.id);
            socket.join(room.id);
            socket.emit("userInfo", user);
            sendRoomsInfo();
            io.to(room.id).emit("room", room);
        }
    })

    socket.on("start", roomID => {
        let room = rooms.find(e => e.id == roomID)
        room.state = 1

        sendRoomsInfo();

        room.timerContainer = setInterval(() => {
            if( room.state == 1 ) {
                if(room.timer < 0 || room.pick.length == (room.users.length - 1)) {
                    room.timer = 60
                    room.state = 2

                    for(let user of room.users) {
                        if(user.wallet == room.judge.wallet) {
                            continue;
                        }

                        const isPickExist = room.pick.find(e => e.user.wallet ==  user.wallet);
                        
                        if( isPickExist ) {
                            continue;
                        } else {
                            room.pick.push( {
                                user : user,
                                text : '',
                            } )
                        }
                    }
                }
            } else if( room.state == 2 && room.timer < 0 ) {
                const voteData = { 
                    room : room,
                    vote : []
                }

                next( voteData );
                room.timer = 10;
            } 

            const sendData = { ...room };
            delete sendData.timerContainer;
            delete sendData.timerOutContainer;

            io.to( room.id ).emit( "room", sendData );
            io.to( room.id ).emit( "timer", room.timer );
            
            room.timer --;
        }, 1000)
    })

    socket.on('content', roomID => {
        const content = getOneCardContent()
        io.to(roomID).emit("content", content);
    })

    const next = async (data) => {
        const content = getOneCardContent()
        let room = rooms.find(e => e.id == data.room.id)

        const db = await MongoClient.connect(db_url);
        const dbo = db.db("card");

        data.vote.forEach(async e => {
            let user = room.users.find(o => o.wallet ==  e)

            if(user) {
                let updateData = {
                    score: 0
                };
                const query = { wallet: e }
                const result = await dbo.collection("users").findOne(query);

                if(!result.score)
                    updateData.score = 0;

                updateData.score = result.score + 50;
                const newValue = { $set: updateData }
                await dbo.collection("users").updateOne( query, newValue);

                if(user.vote) {
                    user.vote = parseInt(user.vote) + 1;
                } else {
                    user.vote = 1
                }
            }
        })

        const winner = room.users.find(e => e.vote > 4)

        if(winner) {
            room.finish()
            clearInterval(room.timerContainer)
            clearTimeout(room.timerOutContainer)
            
            const sendData = { ...room };
            delete sendData.timerContainer;
            delete sendData.timerOutContainer;

            io.to(room.id).emit("room", sendData);
            
        } else {
            room.state = 3
            room.timer = 10;

            room.timerOutContainer = setTimeout( () => {
                room.timer = 60
                room.state = 1
                room.pick = []
                room.turn = parseInt(room.turn) + 1

                const userCount = room.users.length;
                const judgePos  = room.users.findIndex(e => e.wallet == room.judge.wallet)

                let newJudge  = room.users[(judgePos + 1) % userCount]
                newJudge.isJudge = true;
                room.judge = newJudge;

                const sendData = { ...room };
                delete sendData.timerContainer;
                delete sendData.timerOutContainer;

                io.to(room.id).emit("room", sendData);
                io.to(room.id).emit('content', content);

            }, 10000)

            const sendData = { ...room };
            delete sendData.timerContainer;
            delete sendData.timerOutContainer;


            io.to(room.id).emit("room", sendData);
            io.to(room.id).emit("result", data.vote);
        }
    }

    socket.on("next", data => {
        if(data.room.users && data.room.users.length) {
            next(data)
        }
    })

    socket.on("quit", data => {
        quit( data );
    })

    const quit = (data) => {

        const roomIndex = rooms.findIndex(e => e.id ==  data.id);
        if(roomIndex > -1) {
           const room = rooms[roomIndex]
           clearInterval(room.timerContainer);
           clearTimeout(room.timerOutContainer);
            room.users.forEach(element => {
                let user = users.find(e => e.wallet == element.wallet)
                user.room = ""
                user.isPart = false
                user.vote = undefined;
            })

            if(roomIndex !== -1) {
                rooms.splice(roomIndex, 1)
            }

            io.to(data.id).emit("room", null)
            console.log('data_id', data.id)
            console.log("mylog", io.of('/').in(data.id));
            io.of('/').in(data.id).clients(function(error, clients) {
                if (clients.length > 0) {

                    clients.forEach(function (socket_id) {
                        io.sockets.sockets[socket_id].leave(data.id);
                    });
                }
            });
            sendRoomsInfo();
        }
    }

    socket.on("pick", data => {
        let room = rooms.find(e => e.id == data.room.id)

        room.pick.push({
            user : data.user,
            text : data.text
        })

        const sendData = { ...room };
        delete sendData.timerContainer;
        delete sendData.timerOutContainer;

        io.to(room.id).emit("room", sendData);
    })

    socket.on("leave", data => {
        leaveRoom(socket, data);
    })

    socket.on("logout", function () {
        disconnect(socket);
    })

    socket.on("disconnect", function () {
        disconnect(socket);
    });
});

/*
Room state
    0 : waiting,
    1 : progressing,
    2 : emulating,
    3 : displayin the winner,
    4 : finished
*/

function Room (id = "", name = "", users = [], creator = {}, state = 0, pick = [], judge = "", turn = 1, password, pack, timer) {
    this.id = id;
    this.name = name;
    this.creator = creator;
    this.state = state;
    this.users = users;
    this.pick =  pick;
    this.judge = judge;
    this.turn = turn;
    this.password = password;
    this.pack = pack;
    this.timer = timer
}

Room.prototype.accept = function (user) {
    this.users.push(user)
}

Room.prototype.lose = function (user) {
    const index = this.users.findIndex( e => e.wallet === user.wallet)
    if(index !== -1) {
        return this.users.splice(index, 1)[0];
    }
}

Room.prototype.finish = function () {
    this.state = 4;
}

module.exports = Room;
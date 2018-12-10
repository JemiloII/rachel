const init = require('./init');
const {registerAccount} = require('./accounts');


class LeagueOfLegends {
    constructor(bot) {
        init(bot);
    }

    register(member) {
        return registerAccount(member);
    }
}

module.exports = LeagueOfLegends;

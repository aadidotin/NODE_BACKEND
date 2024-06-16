const moment = require('moment');

class common {
    constructor() {
        this.sitename = "";
        this.todaydate = moment().format('YYYY-MM-DD');
        this.todaydatetime = moment().format('YYYY-MM-DD HH:mm:ss');
        this.uniqueid = moment().format('YYMMDDHHmmss') + Math.floor((Math.random() * 100000) + 1);
    }

    // Check Valid Email
    validateEmail(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }
}

const constant = new common();

module.exports = constant;
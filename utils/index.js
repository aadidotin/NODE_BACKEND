const moment = require('moment');

class common {
    constructor() {
        this.sitename = "";
        this.todaydate = moment().format('YYYY-MM-DD');
        this.todaydatetime = moment().format('YYYY-MM-DD HH:mm:ss');
        this.uniqueid = moment().format('YYMMDDHHmmss') + Math.floor((Math.random() * 100000) + 1);
    }
}

const constant = new common();
// console.log(constant);

module.exports = constant;
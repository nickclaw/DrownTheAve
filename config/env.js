module.exports = function() {

    // add some helpful date constants
    Date.Second = 1000;
    Date.Minute = Date.Second * 60;
    Date.Hour = Date.Minute * 60;
    Date.Day = Date.Hour * 24;
    Date.Week = Date.Hour * 7;

    /**
     * Returns a new Date object in UTC
     * @return {Date}
     */
    Date.prototype.toUTC = function() {
        return new Date(
            this.getUTCFullYear(),
            this.getUTCMonth(),
            this.getUTCDate(),
            this.getUTCHours(),
            this.getUTCMinutes(),
            this.getUTCSeconds(),
            this.getUTCMilliseconds()
        );
    }

    /**
     * Rounds down the date, pass in a Date constant
     * @param {Date.Constant} to
     * @return {Date} this
     */
    Date.prototype.floor = function(to) {
        if (to === undefined) to = Date.Day;

        switch (to) {
        case Date.Day:
            this.setHours(0);

        case Date.Hour:
            this.setMinutes(0);

        case Date.Minute:
            this.setSeconds(0);

        case Date.Second:
            this.setMilliseconds(0);
        }

        return this;
    }

    /**
     * Capitalize first letter
     * Taken from: http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
     */
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };
}

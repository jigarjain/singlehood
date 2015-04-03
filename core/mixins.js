/**
 * Common mixins
 *
 * @module mixins
 */
module.exports = function () {
    var _    = require('lodash');


    /**
     * Someone with a name
     *
     * @constructor
     * @class mixins.Person
     */
    function Person() {
        /**
         * @property fname
         * @type {String}
         */
        this.fname = null;

        /**
         * @property lname
         * @type {String}
         */
        this.lname = null;
    }

    /**
     * Someone with an email address and / or phone
     *
     * @constructor
     * @class mixins.Contact
     * @uses mixins.Person
     */
    function Contact() {
        Person.call(this);

        /**
         * @property email
         * @type {String}
         */
        this.email = null;

        /**
         * @property phone
         * @type {PhoneNumber}
         */
        this._phone = null;
    }
    Contact.prototype = _.extend({}, Person.prototype);


    /**
     * A Timestamped object
     *
     * @constructor
     * @class mixins.Timestamped
     */
    function Timestamped() {
        /**
         * @property createTime
         * @type {Date}
         */
        this._createTime = null;

        /**
         * @property updateTime
         * @type {Date}
         */
        this._updateTime = null;

        Object.defineProperties(this, {
            'createTime': {
                'set': function (time) {
                    this._createTime = time.getTime();
                },
                'get': function () {
                    return new Date(this._createTime);
                }
            },
            'updateTime': {
                'set': function (time) {
                    this._updateTime = time.getTime();
                },
                'get': function () {
                    return new Date(this._updateTime);
                }
            }
        });
    }
    Timestamped.prototype = {
        /**
         * Update timestamps
         *
         * @method touch
         * @for mixins.Timestamped
         */
        'touch': function () {
            this._updateTime = _.now();

            if (!this._createTime) {
                this._createTime = _.now();
            }
        }
    };


    /**
     * A storable object
     *
     * @constructor
     * @class mixins.Storable
     * @uses mixins.Timestamped
     */
    function Storable() {
        Timestamped.call(this);

        /**
         * @property _id
         * @type {Object}
         */
        this._id = null;
    }
    Storable.prototype = _.extend({}, Timestamped.prototype);

    return {
        'Person'     : Person,
        'Contact'    : Contact,
        'Timestamped': Timestamped,
        'Storable'   : Storable
    };
};

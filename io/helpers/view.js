var _   = require('lodash'),
url     = require('url'),
version = require('../../package.json').version,
_req, _res;

require('datejs');

function renderFlashMsg() {
    var flash = _req.flash();
    var out = '';
    var types = ['error', 'success', 'info'];

    _.each(types, function (type) {
        if (flash[type]) {
            out += '<div class="flash-msgs '+ type +'">';
            out += '<ul>';

            _.each(flash[type], function (msg) {
                out += '<li>'+msg+'</li>';
            }) ;

            out += '</ul>';
            out += '<a href="#" class="close" data-action="close">&times</a>';
            out += '</div>';
        }
    });
    return out;
}

function eachReverse(context) {
    var options = arguments[arguments.length - 1];
    var ret = '';

    if (context && context.length > 0) {
        for (var i = context.length - 1; i >= 0; i--) {
            ret += options.fn(context[i]);
        }
    } else {
        ret = options.inverse(this);
    }

    return ret;
}

function renderCSSTags (csstags) {
    var out = '';

    if (typeof csstags === 'string') {
        out = out + renderTag({
            'name': 'link',
            'opts': objToKeyval({
                'rel': 'stylesheet',
                'href': csstags
            }),
            'selfclose': true
        });
    } else {
        _.each(csstags, function (css) {
            if (typeof css === 'string') {
                out = out + renderTag({
                    'name': 'link',
                    'opts': objToKeyval({
                        'rel': 'stylesheet',
                        'href': css
                    }),
                    'selfclose': true
                });
            } else {
                out = out + renderTag({
                    'name': 'link',
                    'opts': objToKeyval(css),
                    'selfclose': true
                });
            }
        });
    }

    return out;
}

function renderJSTags(jstags) {
    var out = '';

    if (typeof jstags === 'string') {
        out = out + renderTag({
            'name': 'script',
            'opts': objToKeyval({
                'type': 'text/javascript',
                'src': jstags
            })
        });
    } else {
        _.each(jstags, function (js) {
            if (typeof js === 'string') {
                out = out + renderTag({
                    'name': 'script',
                    'opts': objToKeyval({
                        'type': 'text/javascript',
                        'src': js
                    })
                });
            } else {
                out = out + renderTag({
                    'name': 'script',
                    'opts': objToKeyval(js)
                });
            }
        });
    }

    return out;
}

function objToKeyval(obj) {
    return _.collect(obj, function (val, key) {
        return {'key': key, 'val': val};
    });
}

function renderTag(obj) {
    var tag = '';
    tag = '<' + obj.name + ' ';

    _.each(obj.opts, function (opt) {
        // Add version #tags for local css and js links
        if ((obj.name === 'link' || obj.name === 'script') &&
            (opt.key === 'href' || opt.key === 'src') &&
            !url.parse(opt.val, false, true).host) {
            opt.val = opt.val + '?v=' + version;
        }

        tag += opt.key + '="' + opt.val + '" ';
    });

    if (obj.selfclose) {
        tag += '/>';
        return tag;
    }

    tag += '></' + obj.name + '>';
    return tag;
}

function plusOne(val) {
    return parseInt(val) + 1;
}

function serviceIcon(type) {
    switch(type) {
        case 'gdrive':
            return '/static/img/gdrive.png';
        default:
            return '';
    }
}

function renderDate(date, format) {
    return new Date(date).toString(format);
}

module.exports = {
    'setContext': function (req, res, next) {
        _req = req;
        _res = res;
        next();
    },
    'helpers': {
        'renderCSSTags'       : renderCSSTags,
        'renderJSTags'        : renderJSTags,
        'renderFlashMsg'      : renderFlashMsg,
        'plusOne'             : plusOne,
        'eachReverse'         : eachReverse,
        'serviceIcon'         : serviceIcon,
        'renderDate'          : renderDate,
    }
};

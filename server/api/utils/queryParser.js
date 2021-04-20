
function parsePopulate(param) {
    if (Array.isArray(param)) {
        return param.map(p => parsePopulate(p));
    } else if (typeof param === 'object') {
        return param;
    } else if (param.match(/^[0-9a-z]+$/)) {
        return {path: param};
    } else {
        return JSON.parse(param);
    }
}

function parseQueryParam(param) {
    if (Array.isArray(param)) {
        return {$or: param.map(p => parseQueryParam(p))};
    } else if (typeof param === 'object') {
        return param;
    } else {
        return JSON.parse(param);
    }
}

module.exports = function(req, res, next) {
    req.queryOptions = {
        'populate': req.query.$populate ? parsePopulate(req.query.$populate) : undefined
    }
    delete req.query.$populate;

    for(var param in req.query) {
        try {
             req.query[param] = {$elemMatch: parseQueryParam(req.query[param])};
        } catch(error) {
            // Non-json query param is expected, no action needed
        }
    }
    next();
}
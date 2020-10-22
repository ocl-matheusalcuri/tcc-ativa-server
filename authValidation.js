const jwt = require('jsonwebtoken');
const { promisify } = require('util');

async function validate(req, res, next) {
    const { authorization } = req.headers;

    if(!authorization) return res.sendStatus(401);

    const [, token] = authorization.split(' ');
    try {
        await promisify(jwt.verify)(token, 'segredo');

        return next();
    } catch (error) {
        res.sendStatus(401);
    }
};

module.exports = validate;
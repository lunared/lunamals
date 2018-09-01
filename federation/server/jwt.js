async function AuthRequired(req) {
    const token = req.headers['Authorization'].substr('Bearer '.length);
    try {
        const decoded = req.$jwt.verify(token);
        req.token = decode; 
    } catch (err) {
        res.code(403);
        return {};
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function UserFromToken(req, res){
    if (req.token === null || req.token === undefined) {
        throw Error('Authorization required on route to extract user data');
    }
    try {
        req.user = req.$storage.fetchOne(req.token.id);
    } catch (err) {
        res.code(403);
        return {};
    }
}

module.exports = {
    UserFromToken,
};

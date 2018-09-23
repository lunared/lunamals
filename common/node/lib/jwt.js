/**
 * fastify before handler that verifies auth
 * @param {*} req 
 */
async function AuthRequired(req) {
    const token = req.headers['Authorization'].substr('Bearer '.length);
    try {
        const decoded = req.$jwt.verify(token);
        req.token = decoded; 
    } catch (err) {
        res.code(403);
        return {};
    }
}

module.exports = {
    AuthRequired
};

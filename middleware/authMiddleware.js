const jwt = require('jsonwebtoken');
//TODO need to improve the error handling responses
function authMiddleware(req, res, next) {
    const token = req.header('Authorization');

    // Check for token
    if(!token){
        return res.status(401).json({ message: 'No token, authorization denied'});
    }

    try{
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //Add user from payload
        req.user = decoded;
    next();
    } catch(e){
        console.log(e.message)
        res.status(400).json({ message:e.message});
    }
}

module.exports = authMiddleware;
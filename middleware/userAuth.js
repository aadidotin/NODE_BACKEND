const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) res.status(401).send("Unautherized User");

    try {
        const validate = jwt.verify(token, process.env.JWT_SECRET_CODE, function (error, decoded) {
            if (error) {
                console.log("error", error.message);
                res.status(500).send("Login is Expired")
            }
            else {
                req.context = decoded
                next();
            }
        })
    } catch (error) {
        res.status(401).send("Unautherized User")
    }

}

module.exports = authMiddleware;
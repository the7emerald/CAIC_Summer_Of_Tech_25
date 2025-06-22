const jwt = require("jsonwebtoken");
require("dotenv").config()

function generateAccessToken(user) {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    return token;
}

const checkAuth = async (request, response, next) => {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return response.status(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return response.status(403);
        request.user = user;
    })

    next();

};
const assignToken = (username) => {
    const user = { username };
    const accessToken= generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    return { accessToken, refreshToken };

};




module.exports = { checkAuth, assignToken };
// [ SECTION ] Dependencies and Modules
const jwt = require('jsonwebtoken');


const secret = "OnlineShoppingAPI";

// token creation
module.exports.createAccessToken = (user) => {

    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    return jwt.sign(data, secret, {});
};


module.exports.verify = (req, res, next) => {

    // Token is retrieved from the request header
    // Authorization (Auth Tab) > Bearer Token

    let token = req.cookies['authorization'];
    if (!token || typeof token === "undefined") {
        res.status(400).send({ auth: "Failed, No Token!" });
    } else {
        console.log(token);
        req.userToken = token;

        /*
         Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZjBjMzYyNmNhYzJjM2VhYTBmY2I5YSIsImVtYWlsIjoic3BpZGVybWFuM0BnbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNjQzMjQ1MTEyfQ.c29qelk9GkrnZP10M6wqo6fiTKHPk-c15DcpSBsKq7I 

        */

        jwt.verify(token, secret, function(error, decodedToken) {
            if (error) {
                res.status(400).send({
                    auth: "Failed",
                    message: error.message
                });
            } else {
                console.log(decodedToken);
                // Contains data from our token

                req.user = decodedToken;

                next();
                // Will let us proceed to the next controller
            }
        })
    }
}

// Verify if user  account is admin or not

module.exports.verifyAdmin = (req, res, next) => {
    console.log(req.user);
    if (req.user.isAdmin) {
        next()
    } else {
        res.status(400).send({
            auth: "Failed",
            message: "No Access Granted"
        })
    }
}
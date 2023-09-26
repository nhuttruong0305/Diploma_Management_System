const jwt = require("jsonwebtoken");

const middlewareController = {
    verifyToken: (req, res, next) => {
        //Lấy token
        const token = req.headers.token;
        if(token){
            const accessToken = token.split(" ")[1];

            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, data) => {
                if(err){
                    return res.status(403).json("Token is not valid");
                }
                req.user = data;
                next();
            })
        }else{
            return res.status(401).json("You are not authenticated");
        }
    },

    verifyTokenAndSystemAdministratorRole: (req,res,next) => {
        middlewareController.verifyToken(req, res, () => {
            if(req.user.role[0] == "System administrator"){
                next();
            }else{
                return res.status(403).json("You are not authorized");
            }
        })
    },
}

module.exports = middlewareController;
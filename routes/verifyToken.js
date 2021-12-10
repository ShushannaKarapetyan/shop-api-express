import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.status(403).json('Token is not valid!')
            } else {
                req.user = user;
                next();
            }
            ;
        })
    } else {
        res.status(401).json('You are not authenticated.')
    }
}

export const verifyTokenAndAuthtorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id == req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json('Not Authorized.');
        }
    })
}

export const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json('Not Authorized.');
        }
    })
}


//export {verifyToken, verifyTokenAndAuthtorization};
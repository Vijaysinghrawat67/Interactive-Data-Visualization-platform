export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        //console.log('User in request:', req.user);

        if(!req.user || !roles.includes(req.user.role)){
            return res
            .status(403)
            .json({
                    success : false,
                    message : "You are not authorized to access this route"
            });
        }
        next();
    }
};
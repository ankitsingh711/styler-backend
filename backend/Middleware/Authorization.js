const authorization = (role) => {
    return (req, res, next) => {
        const userRole = req.body.role || req.user?.role;
        
        console.log('Authorization check:', {
            requiredRole: role,
            userRole: userRole,
            userId: req.body.userID || req.user?.userID
        });

        if (role === userRole) {
            next();
        } else {
            res.status(403).json({ 
                success: false,
                message: "Unauthorized. Admin access only.",
                requiredRole: role,
                userRole: userRole
            });
        }
    };
};

module.exports = {
    authorization
};
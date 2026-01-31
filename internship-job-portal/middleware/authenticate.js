export const authenticate = (req, res, next) => {
    const userId = req.headers["x-user-id"];
    const userRole = req.headers["x-user-role"];

    if (!userId || !userRole) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    req.user = {
        id: userId,
        role: userRole,
    };

    next();
};
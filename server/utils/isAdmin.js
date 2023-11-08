// isAdmin.js
export function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'Admin') {
        return next();
    }
    return res.status(403).json({ message: 'Permission denied.' });
}

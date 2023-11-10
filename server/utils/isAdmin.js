// isAdmin.js
export function isAdmin(req, res, next) {
    console.log('User Role:', req.user.role); // Log the user's role
   
    if (req.user && req.user.role === 'Admin') {
        return next();
    }
   
    return res.status(403).json({ error: 'Forbidden', message: 'Permission denied. Admin access required.' });
}

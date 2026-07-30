import express from "express"
import passport from "passport"

const router = express.Router()

router.get('/login/success', (req, res) => {
    if (req.user) {
        return res.status(200).json({ success: true, user: req.user })
    }
    return res.status(401).json({ success: false, user: null })
})

router.get('/login/failed', (req, res) => {
    res.status(401).json({ success: true, message: "failure" })
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }

        req.session.destroy((err) => {
            if (err) {
                return next(err)
            }
            res.clearCookie('connect.sid')

            return res.json({ status: "logout", user: {} })
        })
    })
})

router.get(
    '/github',
    passport.authenticate('github', {
        scope: [ 'read:user' ]
    })
)

router.get(
'/github/callback',
passport.authenticate('github', {
    successRedirect: `${process.env.CLIENT_URL || 'https://client-jl5g.onrender.com'}/`,
    failureRedirect: `${process.env.CLIENT_URL || 'https://client-jl5g.onrender.com'}/destinations`,
})
)

export default router

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const pageRouter = (0, express_1.Router)();
const users = [
    { username: "GustavoFantin", password: "12345" },
    { username: "IklakShake", password: "54321" },
];
/**
 * Dispalys the homepage
 *
 * @route GET /
 * @param {Request} req
 * @param {Response} res
 * @return {void} render the home page
 */
pageRouter.get("/", (req, res) => {
    res.status(200).render("index");
});
/**
 * Displays the login page
 *
 * @route GET /login
 * @param {Request} req
 * @param {Response} res
 * @returns {void} render the login page
 */
pageRouter.get("/login", (req, res) => {
    res.status(200).render("login");
});
/**
 * Check user details
 *
 * @route POST /login
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Responds with a cookie and redirect
 */
pageRouter.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username && user.password === password);
    if (!user) {
        res.status(404).redirect("/login");
        return;
    }
    res.cookie("isLoggedIn", true, {
        maxAge: 5 * 60 * 1000, // 5 minutes
        httpOnly: true,
        signed: true, // Cookie is stored in signedCookies obj
    });
    res.cookie("username", username, {
        maxAge: 5 * 60 * 1000, // 5 minutes
        httpOnly: true,
        signed: true,
    });
    //   res.cookie("age", age, {
    //     maxAge: 5 * 60 * 1000, // 5 minutes
    //     httpOnly: true,
    //     signed: true,
    //   });
    res.status(200).redirect("/profile");
});
/**
 * Log out user
 * @route GET /logout
 * @param {Request} req
 * @param {Response} res
 * @returns {void} Redirects to the login page
 */
pageRouter.get("/logout", (req, res) => {
    res.clearCookie("isLoggedIn");
    res.clearCookie("username");
    //   res.clearCookie("age")
    res.status(301).redirect("/login");
});
pageRouter.get("/check", auth_middleware_1.checkAuth, (req, res) => {
    const { username } = req.signedCookies;
    res.status(200).json({ username });
});
pageRouter.get("/profile", auth_middleware_1.checkAuth, (req, res) => {
    res.status(200).render("profile");
});
exports.default = pageRouter;

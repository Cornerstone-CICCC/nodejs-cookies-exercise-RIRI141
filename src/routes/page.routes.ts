import { Router, Request, Response } from "express";
import { User } from "../types/user";
import { checkAuth } from "../middleware/auth.middleware";

const pageRouter = Router();

const users: User[] = [
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
pageRouter.get("/", (req: Request, res: Response) => {
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
pageRouter.get("/login", (req: Request, res: Response) => {
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
pageRouter.post("/login", (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
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
pageRouter.get("/logout", (req: Request, res: Response) => {
  res.clearCookie("isLoggedIn");
  res.clearCookie("username");
//   res.clearCookie("age")
  res.status(301).redirect("/login");
});

pageRouter.get("/check", checkAuth, (req: Request, res: Response) => {
  const { username } = req.signedCookies;
  res.status(200).json({ username });
})
pageRouter.get("/profile", checkAuth, (req: Request, res: Response) => {
  res.status(200).render("profile");
});

export default pageRouter;

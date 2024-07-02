import { Request, Response } from "express";

class HomeController {
  index(req: Request, res: Response) {
    res.render("index", { user: req.user });
  }
}

export default new HomeController();

import RefreshToken from "../../models/refreshToken";
import { jwtConfig } from "../const.js";
import { v4 } from "uuid";
import User from "../../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const createToken = async (user) => {
  const expiredAt = new Date();
  expiredAt.setSeconds(expiredAt.getSeconds() + jwtConfig.jwtRefreshExpiration);
  const _token = v4();
  const refreshToken = await RefreshToken.create({
    token: _token,
    userId: user.id,
    expiryDate: expiredAt.getTime(),
  });
  return refreshToken.token;
}

export async function postSignIn(req, res, next) {
  const body = req.body;
  try {
    const existUser = await User.findOne({
      where: {
        email: body.email,
      },
    })
    const existUserName = await User.findOne({
      where: {
        username: body.username,
      },
    })
    if (existUser) {
      return res.status(409).json({
        error: "Email already exist, please pick another email! ",
      });
    }
    if (existUserName) {
      return res.status(409).json({
        error: "UserName already exist, please pick another UserName! ",
      });
    }
    const hashedPassword = await bcrypt.hash(body.password, 8);
    const user = await User.create({
      firstName: body.firstName,
      secondName: body.secondName,
      email: body.email,
      username: body.username,
      isLead: body.isLead? body.isLead : false,
      password: hashedPassword,
    });
    res.status(200).json({
      message: "User created",
      user: { id: user.id, email: user.email },
    });
  }
  catch (err) {
    console.log(err);
  }
}

let user;
let token;
export async function postLogin(req, res, next) {
  try {
    const body = req.body;
    user = await User.findOne({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const isPassValid = await bcrypt.compare(body.password, user.password);
    if (!isPassValid) {
      return res
        .status(401)
        .json({ accessToken: null, message: "Invalid password!" });
    }
    token = jwt.sign({ id: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.jwtExpiration,
    });
    const refreshToken = await createToken(user);
    res.status(200).json({
      token: token,
      refresh_token: refreshToken,
    });
  }
  catch (err) {
    console.log(err);
  }
}

export async function postRefreshToken(req, res, next) {
  const body = req.body;
  try {
    if (!body.refresh_token) {
      return res.status(403).json({ message: "Refresh Token is required!" });
    }
    const refreshToken = await RefreshToken.findOne({
      where: { token: body.refresh_token },
    });
    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token does not exist!" });
    }
    if (refreshToken.expiryDate.getTime() < new Date().getTime()) {
      await RefreshToken.destroy({ where: { id: refreshToken.id } });
      return res.status(403).json({
        message: "Refresh token was expired. Please login again!",
      });
    }
    const user = await refreshToken.getUser(); // getUser is magic method of sequelize
    // for seeing the magic methods you should assign a Model to another and for seeing its magic methods in here you should first do your job on Model
    // and assign it to a const or variable and then log its prototypes like below:
    // console.log(refreshToken.__proto__);
    const newAccessToken = jwt.sign({ id: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.jwtExpiration,
    });
    return res.status(200).json({
      token: newAccessToken,
      refresh_token: refreshToken.token,
    });
  }
  catch (err) {
    console.log(err);
  }
}

export async function getUser(req, res, next) {
  res.status(200).json({
    user: {
      id: user.id,
      firstName: user.firstName,
      secondName: user.secondName,
      email: user.email,
      isLead: user.isLead
    },
  });
}

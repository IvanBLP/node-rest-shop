const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token= req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_Key); //verify returns the decoded value
    req.userData = decoded; //:shrugg:
    next();
  } catch (error) {
    return res.status(401).json({
      mesage: "Auth failed"
    });
  }
}

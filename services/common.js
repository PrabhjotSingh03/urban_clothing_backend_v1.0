const passport = require("passport");

exports.isAuthenticate = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.userSanitize = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmYyNmVkMTM1NDVlNWQ3NTcyZmFiYiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk3NTg4OTczfQ.QG9tBf8-zkdzBlcui4OPatX9R1CAhjV-fwujpOvvJs0";
  return token;
};

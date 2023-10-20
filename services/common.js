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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmYyNmVkMTM1NDVlNWQ3NTcyZmFiYiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5Nzc3MzMyM30.S7WAO1FiTEOGI9P39XXrWMheICQqatdPEe1Xcb9e6_4";
  return token;
};

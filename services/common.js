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
  // token =
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MzIwYzJiZDc5MDQ2YTYwZTA1MDg3NCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk3Nzc4NzYyfQ.fyv8Q7FtDQvJmwmx_AqX7v6u_xQL0YLgUGleYKTR7UQ";
  return token;
};

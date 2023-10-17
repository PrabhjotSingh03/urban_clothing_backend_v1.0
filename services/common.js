const passport =require('passport');

exports.isAuthenticate = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.userSanitize = (user) => {
  return { id: user.id, role: user.role };
};

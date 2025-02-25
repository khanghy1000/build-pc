async function logout(req, res) {
  res.clearCookie('username');
  res.clearCookie('password');
  res.redirect('/login');
};

export { logout };
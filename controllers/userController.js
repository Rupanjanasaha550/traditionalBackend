export const uploadProfileImage = async (req, res) => {
  req.user.profileImage = `/uploads/${req.file.filename}`;
  await req.user.save();
  res.json({ user: req.user });
};

export const updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (name) req.user.name = name;
  if (email) req.user.email = email;
  if (password) req.user.password = password;

  await req.user.save();
  res.json({ user: req.user });
};

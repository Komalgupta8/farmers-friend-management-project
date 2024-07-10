const UserModel = require("../Models/UserSchema");

exports.createUser = async (req, res) => {
  const data = req.body;
  try {
    const existingUser = await UserModel.findOne({
        $or: [
          { Email: data.Email },
          { Username: data.Username },
          { PhoneNumber: data.PhoneNumber }
        ]
      });
  
      if (existingUser) {
        return res.status(400).json({ message: "User with same email, username, or phone number already exists" });
      }
    const response = await UserModel.create(data);
    res.status(201).json({ message: "user create sucess", response });
  } catch (error) {
    res.status(501).json({ message: "Problem Is occured", error });
  }
};

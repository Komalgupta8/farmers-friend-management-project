const UserModel = require("../Models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  const {Username,Email,PhoneNumber,Address,Password} = req.body;
  try {
    const existingUser = await UserModel.findOne({
        $or: [
          { Email: Email },
          { Username: Username },
          { PhoneNumber: PhoneNumber }
        ]
      });
  
      if (existingUser) {
        return res.status(400).json({ message: "User with same email, username, or phone number already exists" });
      }

    const newpassword = await bcrypt.hash(Password , 10);
    const response = await UserModel.create({
      Username : Username,
      Email : Email,
      PhoneNumber : PhoneNumber,
      Address : Address,
      Password : newpassword      
    });
    res.status(201).json({ message: "user create sucess", response });
  } catch (error) {
    res.status(501).json({ message: "Problem Is occured", error });
  }
};

exports.LoginUser = async(req,res)=>{
  const {Email,Password} = req.body;
  try {
    const response = await UserModel.findOne({Email:Email});
    if(response){
      const pass = response.Password;
      const check = await bcrypt.compare(Password,pass)
      if(check==true){
        const token = jwt.sign({response},process.env.JWT_SECRET_KEY,{expiresIn: "5hr"});
        return res.cookie('authtoken' , token , {httpOnly:true , secure:true}).status(200).json({message:"Login Succesfull",Token :token})
      }
      return res.status(501).json({message:"Password Missmatch"})
    }
    return res.status(501).json({message : "User Not found"})
  } catch (error) {
    res.status(501).json({message:"Problem Is occured",error})
  }
}

import {User} from "../models/User.js"

const registerUser = async (req, res) => {
  try {
    
    const { name, email, username, password, type } = req.body;
    
    const user = await User.create({
      name,
      email,
      username,
      password, 
      type
    });
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const updatedUser = await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });

    const options = {
      httpOnly: true,
      secure: true
    }

    return res
    .cookie("accessToken", accessToken, options)
    .status(200)
    .json({
      message: user.username+" registered and logged in  successfully",
    })

  } catch (error) {
    
    if (error.code === 11000) {
      if (error.keyPattern.email) {
        return res.status(400).json({ error: "Email already exists" });
      }
      if (error.keyPattern.username) {
        return res.status(400).json({ error: "Username already exists" });
      }
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req,res)=>{
  try {
    const {identity,password} = req.body; // identity can be either email or username
    
    const user = await User.findOne({ $or: [ { email: identity }, { username: identity } ] });
    if(!user){
      return res.status(400).json({
        error: "User not found"
      })
    }
    const isPasswordValid = await user.isPasswordMatch(password);
    if(!isPasswordValid){
      return res.status(400).json({
        error: "Invalid password"
      })
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const updatedUser = await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });

    const options = {
      httpOnly: true,
      secure: true
    }

    return res
    .cookie("accessToken", accessToken, options)
    .status(200)
    .json({
      message: user.username+" logged in  successfully",
    })
       
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export {registerUser, loginUser}

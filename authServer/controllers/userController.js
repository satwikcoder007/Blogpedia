import {User} from "../models/User.js"

const registerUser = async (req, res) => {
  try {
    
    const { name, email, username, password, type } = req.body;

    // Check username OR email
    const check = await User.findOne({ $or: [{ username }, { email }] });
    if (check) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    
    const user = await User.create({
      name,
      email,
      username,
      password, 
      type
    });

    return res.status(200).json({ message: "User registered successfully", data: user });

  } catch (error) {
    console.log("Hello")
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username or email already exists" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export {registerUser}

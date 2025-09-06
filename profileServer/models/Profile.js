import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    index: true, 
  },
  bio: {
    type: String,
    default: "",
  },
  profileImage: {
    type: String,
    default: "",
  },
  follwer: {
    type: Number,
    default: 0,
  },
  following: {
    type: Number,
    default: 0,
  },
});

export const Profile = mongoose.model("Profile", ProfileSchema,"Profiles");
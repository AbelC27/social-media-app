import User from "../models/user.model.js";
import {v2 as cloudinary } from "cloudinary";
//models
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
export const getUserProfile = async (req, res) => {
    const { username } = req.params;

    try {
        const user=await User.findOne({username}).select("-password");
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({error:error.message});
        console.log("Error in getUserProfile",error.message );
    }
}

export const followUserUnfollowUser = async (req, res) => {

    try {
        const {id}=req.params;
        const userToModify= await User.findById(id);
        const currentUser =await User.findById(req.user._id);
       
        if(id==req.user._id.toString()){
            return res.status(400).json({error:"You can't follow/unfollow yourself"});
        }
       
        if(!userToModify|| !currentUser){
            return res.status(404).json({error:"User not found"});
        }
        
        const isFollowing=currentUser.following.includes(id);

        if(isFollowing){
            //unfollow
            await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$pull:{following:id}});
             //return ID of user as response
             //TODO: send notification
            res.status(200).json({message:"Unfollowed successfully"});
        }
        else{
            //follow
            await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
            await User.findByIdAndUpdate(req.user._id,{$push:{following:id}});
            res.status(200).json({message:"Followed successfully"});
            //send notification
            const newNotification= new  Notification({
                type:"follow",
                from:req.user._id,
                to:userToModify._id
            });
            await newNotification.save();
            //return ID of user as response
            //TODO: send notification
            res.status(200).json({message:"Followed successfully"});
        }
    } catch (error) {
        res.status(500).json({error:error.message});
        console.log("Error in followUserUnfollowUser",error.message );
    }
}
export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get users that the current user is not following
        const suggestedUsers = await User.find({
            _id: { 
                $nin: [...user.following, userId] 
            }
        })
        .select("-password")
        .limit(5)
        .sort({ followers: -1 }); // Sort by number of followers to get popular users

        // If we don't have enough suggested users, add some random users
        if (suggestedUsers.length < 5) {
            const randomUsers = await User.find({
                _id: { 
                    $nin: [...suggestedUsers.map(u => u._id), ...user.following, userId] 
                }
            })
            .select("-password")
            .limit(5 - suggestedUsers.length);
            
            suggestedUsers.push(...randomUsers);
        }

        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.log("Error in getSuggestedUsers", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateUser = async (req, res) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if username is already taken by another user
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ error: "Username is already taken" });
            }
        }

        // Check if email is already taken by another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "Email is already taken" });
            }
        }

        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ message: "Please provide current password and new password" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid current password" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "New password should be at least 6 characters long" });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Handle profile image upload
        if (profileImg && profileImg !== user.profileImg) {
            try {
                // Delete old image if exists
                if (user.profileImg) {
                    const publicId = user.profileImg.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }

                // Upload new image
                const uploadedResponse = await cloudinary.uploader.upload(profileImg, {
                    folder: "profile_images",
                    resource_type: "auto",
                    transformation: [
                        { width: 400, height: 400, crop: "fill" },
                        { quality: "auto" }
                    ]
                });
                profileImg = uploadedResponse.secure_url;
            } catch (error) {
                console.error("Error uploading profile image:", error);
                return res.status(500).json({ error: "Error uploading profile image" });
            }
        }

        // Handle cover image upload
        if (coverImg && coverImg !== user.coverImg) {
            try {
                // Delete old image if exists
                if (user.coverImg) {
                    const publicId = user.coverImg.split("/").pop().split(".")[0];
                    await cloudinary.uploader.destroy(publicId);
                }

                // Upload new image
                const uploadedResponse = await cloudinary.uploader.upload(coverImg, {
                    folder: "cover_images",
                    resource_type: "auto",
                    transformation: [
                        { width: 1500, height: 500, crop: "fill" },
                        { quality: "auto" }
                    ]
                });
                coverImg = uploadedResponse.secure_url;
            } catch (error) {
                console.error("Error uploading cover image:", error);
                return res.status(500).json({ error: "Error uploading cover image" });
            }
        }

        // Update user fields
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (username) user.username = username;
        if (bio) user.bio = bio;
        if (link) user.link = link;
        if (profileImg) user.profileImg = profileImg;
        if (coverImg) user.coverImg = coverImg;

        user = await user.save();
        user.password = null;

        res.status(200).json(user);
    } catch (error) {
        console.log("Error in updateUser:", error.message);
        res.status(500).json({ error: error.message });
    }
};
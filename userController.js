const bcrypt = require('bcrypt');
const User = require('../model/schema')
var jwt = require('jsonwebtoken');
const { upload } = require('../mutar/multar')
const path = require('path')
const { verifyToken } = require('../middleware/verifyToken')
const speakEasy = require('@levminer/speakeasy')
// require('dotenv').config()
const qrCode = require('qrcode')
const stakinghistory = require('../model/stakinghistorySchema');
const stakingSchema = require('../model/stakingSchema');
const liqudityschema = require('../model/stakingTokenSchema');
const stakingTokenSchema = require('../model/stakingTokenSchema');
const stakinghistorySchema = require('../model/stakinghistorySchema');
const FAQModal = require('../model/faqSchema')
const ClaimReward = require('../model/claimRewardSchema')

exports.get = (req, res, next) => {
    try {
        User.find({})
            .then((data) => res.json({ data }))
            .catch((err) => res.json(err));
        // res.send({msg:"asdfasdf"})
    } catch (error) {
        console.log(error);
    }
}


// exports.post = async (req, res) => {
//     console.log(req.body);
//     try {
//         // console.log(req.body);
//         const { firstName, lastName, email, username, password } = req.body;
//         // Hashing the password
//         const hashedPassword = await bcrypt.hash(password, 10);
//         // Note: Do not compare the password immediately after hashing
//         // const isPasswordMatch = bcrypt.compareSync('user_password', hashedPassword);
//         const newUser = new User({
//             firstName,
//             lastName,
//             email,
//             username,
//             password : hashedPassword // Save the hashed password to the database
//         });
//         await newUser.save();
//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ message: "Registration failed", error: error.message });
//     }
// };

// exports.post = async (req, res) => {
//     upload(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({ message: "Image upload failed", error: err });
//         }
//         try {
//             console.log(req.body);
//             const { firstName, lastName, username, email, password, profileImage } = req.body;
//             const encrptPassword = await bcrypt.hash(password, 10);

//             const newUser = new User({
//                 firstName,
//                 lastName,
//                 email,
//                 username,
//                 password: encrptPassword,
//                 profileImage: path.join("uploads/", req.file.filename)
//             });
//             await newUser.save();
//             res.status(201).json({ message: "User registered successfully" });
//         } catch (error) {
//             res.status(400).json({ message: "Registration failed", error: error.message });
//         }
//     });
// };


exports.fetchuser = (req, res, next) => {
    try {
        User.find({})
            .then((data) => res.json({ data }))
            .catch((err) => res.json(err));
    } catch (error) {
        console.log(error);
    }
}

exports.getsingleuserById = (req, res, next) => {
    console.log(req.params.id);
    const userid = req.params.id;
    try {
        User.findOne({ _id: userid })
            .then((data) => res.json({ data }))
            .catch((err) => res.json(err));
    } catch (error) {
        console.log(error);
    }
}

exports.forgetPassword = async (req, res) => {
    console.log(req.body);
    try {
        const { email } = req.body
        const getUserData = await User.findOne({ email })
        if (!getUserData) {
            return res.status(401).json({ message: 'User Not Found' })
        }
        const generateOTP = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        await User.updateOne({ email }, { $set: { 'otp.code': generateOTP } })
        const updateOtpData = await User.findOne({ email })
        res.status(200).json(updateOtpData)
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' })
    }

}

exports.createUser = async (req, res) => {
    const exiting = await User.findOne({ email: req.body.email })
    if (exiting) {
        return res.status(409).json({ message: "Already User Exiting" })
    }
    try {
        const { firstName, lastName, username, email, password } = req.body
        const generateOTP = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const hashPassword = await bcrypt.hash(password, 10)
        const createUser = {
            firstName,
            lastName,
            username,
            email,
            password: hashPassword,
            otp: {
                code: generateOTP.toString(),
                //10mintunes Validate
                expiration: new Date(Date.now() + 10 * 60 * 1000),
                verified: false,
            },
        }
        User.create(createUser)
            .then((data) => res.status(201).json({ message: "Register SuccessFully", data }))
            .catch(() => res.status(404).json({ message: "Some Went Wrong" }))
    } catch (err) {
        res.status(500).json({ message: 'Internal Error' })
    }
}



exports.login = async (req, res) => {
    console.log(req.body);
    try {
        const { username, password } = req.body;
        const users = await User.findOne({ username: username });
        console.log(users)
        const passwordCheck = await bcrypt.compare(password, users.password);
        if (!passwordCheck) {
            return res.status(400).json({ message: "Login failed, incorrect password" });
        }
        const generateOTP = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        await User.updateOne({ username }, { $set: { 'otp.code': generateOTP } })
        const updateOtpData = await User.findOne({ username })
        console.log(updateOtpData);
        // // If email and password are valid, create and send a JSON Web Token (JWT)
        // const token = jwt.sign({ _id: users._id }, 'xfgfghfhdsfsdfsfd', { expiresIn: "1hr" });
        res.status(200).json({ updateOtpData });
    } catch (error) {
        console.error("Login failed", error);
        res.status(500).json({ message: "Server error" });
    }
}

exports.loginverifyOtp = async (req, res) => {
    try {
        const { otp, id } = req.body
        const loginData = await User.findOne({ _id: id })
        // If email and password are valid, create and send a JSON Web Token (JWT)
        const token = jwt.sign({ _id: loginData._id }, 'aaraa', { expiresIn: "1hr" });
        if (!(otp === loginData.otp.code)) {
            return res.status(404).json({ message: 'Your OTP Wrong' })
        } else {
            return res.status(200).json({ message: 'OTP Verified', token })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Error" })
    }
}

exports.handleTwoFactorAuthentication = async (req, res) => {
    try {
        const { id } = req.body
        const secretCode = speakEasy.generateSecret()
        await User.updateOne({ _id: id }, { $set: { temp_secret: secretCode } })
        const twoFactorAuthData = await User.findOne({ _id: id })

        // generating QrCode Img Src
        qrCode.toDataURL(twoFactorAuthData.temp_secret.otpauth_url, function (err, data) {
            if (err) {
                return res.status(404).json({ message: 'Generating QrCode Error' })
            }
            res.status(200).json({ message: 'Generate TwoFactorAuth', twoFactorAuthData, qrCodeImgSrc: data })
        })

    } catch (error) {
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

exports.verifyTwoFactorAuthentication = async (req, res) => {
    try {
        const { id, token } = req.body
        const getUser = await User.findOne({ _id: id })
        const { base32: secret } = getUser.temp_secret
        // res.status(200).json({ message: 'Generate TwoFactorAuth', secretCode })
        let tokenValidates = speakEasy.totp.verify({
            secret,
            encoding: "base32",
            token,
        })

        if (!tokenValidates) {
            return res.status(404).json({ message: 'Authentication Invalid' })
        }

        let qrCodeVerify = speakEasy.totp.verify({
            secret: getUser.temp_secret.ascii,
            encoding: 'ascii',
            token
        })
        if (!qrCodeVerify) {
            return res.status(401).json({ message: 'Authentication Invalid' })
        }
        const jwtToken = jwt.sign(
            { id: getUser._id },
            // process.env.ACCESS_TOKEN_SECERT,
            'aaraa',
            { expiresIn: '1h' }
        )
        await User.updateOne({ _id: id }, { $set: { temp_secret: null, secret: getUser.temp_secret, twoFactorAuth: true } })
        const updateUser = await User.findOne({ _id: id })
        res.status(200).json({ message: 'Authentication Verified', twoFactorAuth: updateUser.twoFactorAuth, token: jwtToken })

    } catch (error) {
        res.status(500).json({ message: 'Error Generating Authencation ' })
    }
}

exports.getTwoFactorAuthentication = async (req, res) => {
    try {
        const { id } = req.body
        const secretCode = speakEasy.generateSecret()
        await User.updateOne({ _id: id }, { $set: { temp_secret: secretCode } })
        const twoFactorAuthData = await User.findOne({ _id: id })

        // generating QrCode Img Src
        qrCode.toDataURL(twoFactorAuthData.temp_secret.otpauth_url, function (err, data) {
            if (err) {
                return res.status(404).json({ message: 'Generating QrCode Error' })
            }
            res.status(200).json({ message: 'Generate TwoFactorAuth', twoFactorAuthData, qrCodeImgSrc: data })
        })

    } catch (error) {
        res.status(500).json({ message: 'Something Went Wrong' })
    }
}

exports.disableTwoFactorAuthentication = async (req, res) => {
    try {
        const { id } = req.body
        await User.updateOne({ _id: id }, { $set: { secret: null, twoFactorAuth: false } })
        res.status(200).json({ message: 'Disabled Your Authetication' })

    } catch (error) {
        res.status(500).json({ message: 'Error Disable Your Authentication' })
    }
}


exports.verifyOtp = async (req, res) => {
    console.log(req.body);
    try {
        const { otp, id } = req.body
        let userData = await User.findOne({ _id: id })
        if (!(otp === userData.otp.code)) {
            res.status(404).json({ message: 'Your OTP Wrong' })
            return
        } else {
            res.status(200).json({ message: 'OTP Verified' })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Error" })
    }
}

exports.setNewPassword = async (req, res) => {
    console.log(req.body);
    try {
        const { password, id } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        await User.updateOne({ _id: id }, { $set: { password: hashPassword } })
        res.status(200).json({ message: 'Password Updated' })
    } catch (err) {
        res.status(500).json({ message: "Internal Error" })
    }
}

exports.changePassword = async (req, res) => {
    console.log(req.body);
    try {
        const { id, password, newPassword } = req.body
        const users = await User.findOne({ _id: id })
        console.log(users);
        if (!users) {
            return res.status(400).json({ message: "Login failed, user not found" });
        }
        
        const passwordMatch = await bcrypt.compare(password, users.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "incorrect old password" });
        }
        const hashPassword = await bcrypt.hash(newPassword, 10)
          await User.updateOne({ _id: id }, { $set: { password: hashPassword } })
        res.status(200).json({ message: 'Password Updated' })
    } catch (err) {
        res.status(500).json({ message: "Please Check Your Old Password" })
    }
  }
  
exports.fetchuserById = (req, res) => {
    console.log(req.params.id);
    const userid = req.params.id;
    try {
        User.findOne({ _id: userid })
            .then((data) => res.json({ data }))
            .catch((err) => res.json(err));
    } catch (error) {
        console.log(error);
    }
}

// exports.handlekyc = async (req, res, next) => {
//     console.log(req.body);
//     upload
//    (req, res,  async (err) => {
//        if (err) {
//        return res.status(400).json({ error: err.message });
//        }      
//          const id = req.params.id
//          const userexists = await User.findOne({ _id:id
//          })
//         //  if(!userexists){
//         //    return res.status(401).json({ message:'image unsucessfully'});
//         //  }else{
 
//          const frontSideImg=req.files.frontSideImg[0].path
//          const backSideImg=req.files.backSideImg[0].path
//          const kycSelfieImg=req.files.kycSelfieImg[0].path
//          // console.log(backSideImg,typeof(backSideImg));
 
//            User.updateOne({ _id:id
//            },{ $set:{             
//              frontSideImg:frontSideImg,
//              backSideImg:backSideImg, 
//              kycSelfieImg:kycSelfieImg,
//              "kycstatus" : false,
//            } }).then((data)=>res.status(200).json({message:'kyc upload sucessfully',data})).catch((err)=> res.status(404).json({message:'Error in kyc upload ',err}))
         
//          }
 
//    );
//         };

exports.handlekyc =  async (req, res) => {
    upload.fields([
    //   { name: "selectproof" },
    //   { name : "pannumber"},
      { name: "frontSideImg" },
      { name: "backSideImg" },
      { name: "kycSelfieImg" },
     
    ])(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      //console.log(req.files); //check file receieve
    //   console.log(req.body.id);
      const id = req.body.id;
      const userexists =   User.findOne({ _id: id });
      if (!userexists) {
        return res.status(401).json({ message: "image unsucessfully" });
      } else {
        const { selectproof, pannumber } = req.body;
    
        const frontSideImg=req.files.frontSideImg[0].filename
        console.log(frontSideImg);
        const backSideImg=req.files.backSideImg[0].filename
        console.log(backSideImg);
        const kycSelfieImg=req.files.kycSelfieImg[0].filename
    console.log(kycSelfieImg);
  
        User.updateOne(
          { _id: id },
          {
            $set: {
              selectproof,
              pannumber,
              frontSideImg: path.join("/uploads", frontSideImg),
              backSideImg: path.join("/uploads", backSideImg),
              kycSelfieImg: path.join("/uploads", kycSelfieImg)
            },
          } 
        )
          .then((data) =>
            res.status(200).json({ message: "kyc upload sucessfully", data })
          )
          .catch((err) =>
            res.status(404).json({ message: "Error in kyc upload ", err })
          );
      }
    });
  };


exports.handlebuyplan=async(req,res)=>{
    const{ planid, storage}=req.body
    const userexists = await ClaimReward.findOne({ _id:storage })
    const planexists=await  stakingSchema.findOne({_id:planid})
try{
     if (!userexists){
    return res.status(401).json({ message:' user not found'});
  }
  else if(!planexists){
    return res.status(401).json({ message:'plan not found'});
  }else{
    res.status(200).json(planexists)
  }

}catch(error){
    console.log(error);
}
 };



exports.handlestake = async (req, res) => {
  const { Amount } = req.body.data;
  const planid = req.body.planid;
  const id = req.body.userId;

  try {
    const userexists = await User.findOne({ _id: id });
    const planverify = await stakingSchema.findOne({ _id: planid });
    const amountVerify= await liqudityschema.findOne({userId:id})

    if (!userexists || !planverify) {
      return res.status(404).json({ message: 'User or staking plan not found' });
    } 
    const { planmonth, planinterest, planname } = planverify;
    const interestRate = planinterest / 100;
    const monthlyInterest = (Amount * interestRate) / planmonth;
    await stakinghistory.create({
      userId: id,
      planname:planname,
      planamount:Amount,
     amountinterest:monthlyInterest,
    });

   await stakinghistory.updateOne({userId:id})    
    res.status(200).json({  message: 'Staking successful',});
  } catch (error) {
    console.error('Error in staking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// exports.handlestake = async (req, res) => {
//     const { Amount } = req.body.data;
//     const planid = req.body.planid;
//     const id = req.body.userId;
  
//     try {
//       const userexists = await User.findOne({ _id: id });
//       const planverify = await stakingSchema.findOne({ _id: planid });
//       const amountVerify= await liqudityschema.findOne({userId:id})
  
//       if (!userexists || !planverify) {
//         return res.status(404).json({ message: 'User or staking plan not found' });
//       } 
//       const { planmonth, planinterest, planname } = planverify;
//       const interestRate = planinterest / 100;
//       const monthlyInterest = (Amount * interestRate) / planmonth;
//       await stakinghistory.create({
//         userId: id,
//         planname:planname,
//         planamount:Amount,
//        amountinterest:monthlyInterest,
//       });
  
//      await liqudityschema.updateOne({userId:id}, {$inc:{Lptokens:-Amount}})    
//       res.status(200).json({  message: 'Staking successful',});
//     } catch (error) {
//       console.error('Error in staking:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };


exports.deleteuserById = (req, res, next) => {
    console.log(req.params.id);
    try {
        User.findOneAndDelete({ _id: req.params.id })
            .then((data) => res.json({ message: 'User deleted successfully' }))
            .catch((err) => res.status(404).json({ message: 'User not found' }));
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.updateById = async (req, res) => {
    // console.log(req.body)
    try {
        const { firstName, email } = req.body.data; // Remove _id as it's already in the route params
        const userId = req.params.id; // Get the user ID from route params
        const updatedUser = await User.findByIdAndUpdate(userId, {
            firstName: firstName,
            email: email,
        }, { new: true }); // Add { new: true } option to return the updated document

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(400).json({ message: "Request Failed", error: error.message });
    }
}

exports.getSingle = async (req, res) => {
    try {
        const token = req.headers.authorization;
        console.log(token);
        const tokenVerification = verifyToken(token);
        if (tokenVerification.error) {
            return res.status(401).json({ message: tokenVerification.error });
        }
        const { decoded } = tokenVerification;
        const userID = decoded.data;
        // console.log(decoded);
        const foundUser = await User.findOne({ _id: userID });
        if (!foundUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ data: foundUser });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching user", error: error.message });
    }
};

exports.forgetPasswordverifyOtp = async (req, res) => {
    try {
        const { otp, id } = req.body
        const userData = await User.findOne({ _id: id })
        if (!(otp === userData.otp.code)) {
            return res.status(404).json({ message: 'Your OTP Wrong' })
        } else {
            res.status(200).json({ message: 'OTP Verified' })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Error" })
    }
}

exports.getUserDetails = async (req, res) => {
    console.log(req.body);
    try {
      const { id } = req.body;
      const getUserDetails = await User.findOne({ _id: id });
      console.log(getUserDetails);
      
      res.status(200).json({ message: 'FetchData Success', getUserDetails });
    } catch (err) {
      res.status(500).json({
        message: ' Error Generating Profile Details',
        error: err.message,
      });
    }
  };


exports.updateUserDetails = async (req, res) => {
      try {
        const { id, image, email, subject, name } = req.body;
  console.log(id);
        const getUserData = await User.updateOne(
          { _id: id },
          {
            $set: {
              email,
              subject,
              name,
            },
          }
        );
        // console.log(getUserData);
  
        res.status(201).json({ message: 'Profile Updated' });
      } catch (error) {
        res.status(400).json({ message: 'Upload Failed', error: error.message });
      }
    };
  

    exports.handleplan= async (req,res)=>{
        try {
            const getAllplan = await stakingSchema.find()
            res.status(200).json({ message: 'data recieved successfully', getAllplan })
        }catch (error) {
            res.status(401).json({ message: 'error in planlist ' })
        }
    }

exports.handlebuyer = async(req, res) =>{
    const{id}=req.query
    console.log(id);
    try{
        const getAllbuyer = await stakinghistory.find({userId:id})
        res.status(200).json({message : 'Buyerdata received sucessfully..', getAllbuyer})
    }catch(error){
         res.status(401).json({message : 'Error in buylist'})
   }
};

exports. faqFetchingData = async (req, res) => {
    try {
        const faqDatas = await FAQModal.find({})
        res.status(200).json({ message: 'Fetching Data SuccessFully', faqDatas })
    } catch (error) {
        res.status(500).json({ message: 'Error Generating Fetching Faq Updates', error: err.message })
    }
}

exports.claimReward =  async (req, res) => {
    const { id, annualInterest } = req.body;
    console.log(id);
     try { 
           const user = await User.findOne({ _id: id });
            if (!user) {
              return res.status(404).json({ error: 'User not found' });
            }        
            const updatedBalance = user.balance + annualInterest;
            await ClaimReward.findByIdAndUpdate(id, { balance: updatedBalance });
           const updatedUser = await ClaimReward.findOne({ _id: id });
            res.json({ user: updatedUser });
          } catch (error) {
            console.error('Error claiming reward:', error);
          }
}




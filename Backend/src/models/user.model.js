import {mongoose, Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';


const userSchema = new Schema({
    username : {
        type :String,
        required : true,
        unique : true,
        lowerCase : true,
        trim : true,
        index : true
    },
    name : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']

    },
    password : {
        type : String,
        required : [true, 'password is required'],
    },
    role : {
        type : String, 
        enum : ["super-admin","admin","user"], default : "user"
    },
    profileImage : {
        type : String,
        default : ""
    },
    refreshtoken : {
        type : String
    },
    bio : {
        type :String,
        default : "",
    },
    location : {
        type : String,
        default : ""
    },
    socialLinks : {
        website : {type : String, default : ""},
        github : {type: String, default : ""},
        linkedin : {type : String, default : ""}
    },
    phNumber : {
        type : Number
    }
},

{
    timestamps : true
});


userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function(){
    try {
        return jwt.sign( 
            {
                _id : this._id,       // payload
                email : this.email,
                username : this.username,
                role : this.role
            }, 
            config.ACCESS_TOKEN,
            {
                expiresIn : config.ACCESS_EXP
            }
        )
    } catch (error) {
        throw new Error("Failed to generate access token");
    }
}

userSchema.methods.generateRefreshToken = async function(){
    const payload = {
        _id : this._id,
        username : this.username,
    };

    const refreshToken = jwt.sign(
        payload,
        config.REFRESH_TOKEN,
        {
            expiresIn : config.REFRESH_EXP
        }
    );

    
    return refreshToken;
}



export const User = mongoose.model('User', userSchema);
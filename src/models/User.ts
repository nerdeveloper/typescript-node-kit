import mongoose from "mongoose";
import validator from "validator";
import md5 from "md5";
import passportLocalMongoose from "passport-local-mongoose";

/** @ts-ignore - This allow the the typescript compiler to ignore untyped JS modules/libraries */

//@ts-ignore
import mongoosedbErrorHandler from "mongoose-mongodb-errors";

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    gravatar: string;
    posts: any;
    token: any;
    googleId: string;
    linkedinId: string;
    facebookId: string;
    dropboxId: string;
    githubId: string;
    twitterId: string;
    discordId: string;
    slackId: string;
};

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: [true, "Please enter your email address"],
            trim: true,
            validate: [validator.isEmail, "Invalid Email address"],
        },
        googleId: String,
        linkedinId: String,
        dropboxId: String,
        githubId: String,
        twitterId: String,
        facebookId: String,
        discordId: String,
        slackId: String,
        token: String,
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    },
);

userSchema.virtual("gravatar").get(function() {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=30`;
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: "email",
    errorMessages: {
        UserExistsError: "A user with the given email is already registered",
    },
});

userSchema.plugin(mongoosedbErrorHandler);

export const User = mongoose.model("User", userSchema as mongoose.PassportLocalSchema<UserDocument, mongoose.Model<UserDocument>>);

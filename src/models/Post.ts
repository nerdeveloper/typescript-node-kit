import * as mongoose from "mongoose";

export type PostDocument = mongoose.Document & {
    title: string;
    description: string;
};

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: "Please enter the title of your Post",
        },
        description: {
            type: String,
            required: "Please enter the description of your Post",
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: "You must supply an author",
        },
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
    },
);

export const Post = mongoose.model<PostDocument>("Post", postSchema as mongoose.Schema<PostDocument>);

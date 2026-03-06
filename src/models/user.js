import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            transform: (doc, ret) => {
                delete ret.password;
                return ret;
            },
        },
    },
);

userSchema.pre('save', function (next) {
    if (!this.username) {
        this.username = this.email;
    }
    next();
});

export const User = model('user', userSchema);

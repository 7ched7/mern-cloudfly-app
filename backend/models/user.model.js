const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const MAX_STORAGE = 1024 * 1024 * 1024; // 1 GB

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please provide your first name"],
            minlength: [2, "Your first name must be at least 2 characters"],
            maxlength: [25, "Your first name must be maximum 25 characters"],
        },
        lastName: {
            type: String,
            required: [true, "Please provide your last name"],
            minlength: [2, "Your last name must be at least 2 characters"],
            maxlength: [25, "Your last name must be maximum 25 characters"],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function (value) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: "Please provide valid email address",
            },
        },
        password: {
            type: String,
            required: [true, "Please provide your password"],
            minlength: [6, "Your password must be at least 6 characters"],
        },
        profileImage: {
            type: String,
            default: function () {
                return `${process.env.BASE_URL}/images/default-profile-image.jpg`;
            },
        },
        currentStorage: {
            type: Number,
            default: 0,
            min: 0,
        },
        maxStorage: {
            type: Number,
            default: MAX_STORAGE,
            min: 0,
        },
    },
    { timestamps: true }
);

// hash password
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// compare password
userSchema.method("comparePassword", async function comparePassword(password) {
    return await bcrypt.compare(password, this.password);
});

// delete other records
userSchema.pre("deleteOne", { document: true }, async function () {
    await this.model("file").deleteMany({ owner: this._id });
    await this.model("folder").deleteMany({ owner: this._id });
    await this.model("reset_password_token").deleteMany({ user: this._id })
});

module.exports = mongoose.model("user", userSchema);

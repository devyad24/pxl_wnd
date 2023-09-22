const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now, expires: '24h'
    },
});

module.exports = mongoose.model("Session", SessionSchema);
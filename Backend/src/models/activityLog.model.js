import mongoose, {mongoose, Schema} from "mongoose";


const activityLogSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    actiontype : {
        type : String,
        enum : ["created", "edited", "deleted", "shared"],
        required : true,
    },
    visualizationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Visualization',
        default : 'null',
    },
    timestamp : {
        type : Date,
        default : Date.now,
    }
})

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
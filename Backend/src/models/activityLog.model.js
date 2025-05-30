import  {mongoose, Schema} from "mongoose";


const activityLogSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    actiontype : {
        type : String,
        required : true,
    },
    visualizationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Visualization',
        default : 'null',
    },
    meta: {
        type: Object,
        default: {},
      },
}, {
    timestamps: true,
})

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
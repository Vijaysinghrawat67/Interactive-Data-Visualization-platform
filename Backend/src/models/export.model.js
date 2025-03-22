import mongoose, {mongoose, Schema} from 'mongoose'

const exportSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    visualizationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Visualization',
        required : true,
    },
    exportFormat : {
        type : String,
        enum : ["csv", "png", "pdf", "json"],
        required: true,
    },
    downloadLink : {
        type :String,
        required : true,
    }
},
{
    timestamps : true
})

export const Export = mongoose.model('Export', exportSchema);
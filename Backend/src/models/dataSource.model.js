import {mongoose, Schema} from 'mongoose';

const dataSourceSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    sourceType : {
        type : String,
        enum : ["csv", "json", "api"],
        required : true,
    },
    sourcePath : {
        type : String,
        default : null,
    },
    filePath : {
        type : String,
        default : null,
    },
    schema : {
        type : Object,
        required : true,
    }
},{
    timestamps: true
})


export const DataSources = mongoose.model('DataSource', dataSourceSchema);
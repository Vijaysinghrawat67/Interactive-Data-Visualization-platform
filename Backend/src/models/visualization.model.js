import { mongoose, Schema } from 'mongoose';


const visualizationSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.objectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        chartType: {
            type: String,
            enum: ["bar", "line", "pie", "scatter"],
            required: true,
        },
        datasourceId: {
            type: mongoose.Schema.Types.objectId,
            ref: 'Datasources',
            required: true,
        },
        config: {
            type: Object,
            required: true,
        },
        isPublic: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    })


export const Visualization = mongoose.model('Visualization', visualizationSchema);
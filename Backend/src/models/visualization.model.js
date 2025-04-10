import { mongoose, Schema } from 'mongoose';


const visualizationSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
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
            enum: ["bar", "line", "pie", "scatter", "area"],
            required: true,
        },
        datasourceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DataSource',
            required: true,
        },
        xField: {
            type: String,
            required: true
          },
        yField: {
            type: String,
            required: true
          },
        config: {
            type: Object,
            required: true,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        collaborators: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          ],
    },
    {
        timestamps: true,
    })


export const Visualization = mongoose.model('Visualization', visualizationSchema);
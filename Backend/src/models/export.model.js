import { mongoose, Schema } from "mongoose";
const exportSchema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    visualizations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visualization',
        required: true,
      }
    ],
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    layout: {
      type: [Schema.Types.Mixed], // e.g., "grid", "column", "custom"
      default: [],
    },
    exportFormat: {
      type: String,
      enum: ['csv', 'png', 'pdf', 'json'],
      required: true,
    },
    downloadLink: {
      type: String,
      required: true,
    },
  }, { timestamps: true });
  
  export const Export = mongoose.model('Export', exportSchema);
  
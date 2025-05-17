import { mongoose, Schema } from "mongoose";

const exportSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  visualizations: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      title: { type: String, required: true },
      chartType: { type: String, required: true },
      xField: { type: String },
      yField: { type: String },
      config: { type: Schema.Types.Mixed },
      data: { type: Array, default: [] },
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
    type: [Schema.Types.Mixed],
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

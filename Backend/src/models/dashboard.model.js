import { mongoose, Schema } from 'mongoose';

const dashboardSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    charts: [
      {
        id: String,
        chartType: String,
        xField: String,
        yField: String,
        config: { type: mongoose.Schema.Types.Mixed, required: true }, // Change here: config is now Mixed (can store any type)
        data: Array,
        layout: Object
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Dashboard = mongoose.model("Dashboard", dashboardSchema);

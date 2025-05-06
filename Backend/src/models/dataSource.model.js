import mongoose, { Schema } from "mongoose";


const dataSourceSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name : {
      type : String,
      required : true,
      trim : true,
    },
    sourceType: {
      type: String,
      enum: ["csv", "json", "api", "text", "xlsx"],
      required: true,
    },
    sourceDetails: {
      type: Object,
      default: {},
    },
    schemaFields: { // 🔁 renamed from "schema"
      type: [String],
      required: true,
    },
    data: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    xAxis:{
      type: String,
      default: ""
    },
    yAxis:{
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["pending", "processing", "processed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const DataSource =
  mongoose.models.DataSource || mongoose.model("DataSource", dataSourceSchema);

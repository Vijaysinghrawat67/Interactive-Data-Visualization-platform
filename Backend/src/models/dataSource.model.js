import mongoose, { Schema } from "mongoose";

const dataSourceSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,  // Faster lookups for user's data sources
    },
    sourceType: {
      type: String,
      enum: ["csv", "json", "api", "text"], // Added "text" if supporting text-based sources
      required: true,
    },
    sourceDetails: {
      type: Object, // Stores API URL, file metadata, etc.
      default: {},
    },
    schema: {
      type: Object, // Defines column names/types for structured data
      required: true,
    },
    data: {
      type: Array, // Stores processed/parsed data (optional)
      default: [],
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

export const DataSource = mongoose.model("DataSource", dataSourceSchema);

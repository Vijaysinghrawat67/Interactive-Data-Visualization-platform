import {ActivityLog} from '../models/activityLog.model.js';



export const logActivity = async ({ userId, actiontype, visualizationId = null, meta = {} }) => {
  try {
    await ActivityLog.create({
      userId,
      actiontype,
      visualizationId,
      meta
    });
    console.log("✅ Activity logged:", actiontype);
  } catch (err) {
    console.error("❌ Error logging activity:", err.message);
  }
};
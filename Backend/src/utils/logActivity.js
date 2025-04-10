import {ActivityLog} from '../models/activityLog.model.js';



export const logActivity = async({userId, actionType, visualizationId = null, meta = {} }) => {
    try {
        const log = new ActivityLog({
            userId,
            actionType,
            visualizationId,
            meta
        });

        await log.save();
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}
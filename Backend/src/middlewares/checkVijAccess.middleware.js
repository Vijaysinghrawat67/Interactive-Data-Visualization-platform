import { Visualization } from '../models/visualization.model.js';


export const checkVizAccess = async (req, res, next) => {
    try {
        const {userId} = req.user._id;
        const {id} = req.params;

        const viz = await Visualization.finById(id);
        if(!viz) {
            return res.status(404).json({ message: 'Visualization not found' });
        }

        const isOwner = viz.userId.toString() === userId.toString();
        const isCollaborator = viz.collaborators.includes(userId);

        if(!isOwner && !isCollaborator) {
            return res.status(403).json({ message: 'Access denied' });
        }

        req.Visualization = viz;
        next();

    } catch (error) {
        console.error("Access check failed:", err);
         res.status(500).json({ message: "Internal server error" });
    }
}
import {Router} from 'express';
import{ createVisualization, deleteVisualization, getSingleVisualization, getUserVisualization, updateVisualization } from '../controllers/visualization.controller.js';
import {veryfyJWT} from '../middlewares/auth.middleware.js';

const visualize = Router();
visualize.use(veryfyJWT);

visualize.route('/').post(createVisualization);
visualize.route('/').get(getUserVisualization);
visualize.route('/:id').get(getSingleVisualization);
visualize.route('/:id').put(updateVisualization);
visualize.route('/:id').delete(deleteVisualization);

export default visualize;   
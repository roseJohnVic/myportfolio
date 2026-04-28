import express from 'express';
import { deleteAllUsers, deleteUserById, getUser, saveUsers } from '../controllers/contactController.js';


const router = express.Router();


router.post('/save-contact',saveUsers);
router.get('/',getUser);
router.delete('/',deleteAllUsers);
router.delete('/:id',deleteUserById);

export default router;

const express = require('express');
const router = express.Router();
import postController from '../controllers/postController';
import authenticateToken from '../middleware/authenticateToken';
import { upload } from '../middleware/fileUpload';

// /posts
router.post(
    '/new',
    authenticateToken,
    upload.single('image'),
    postController.createNewPost
);
router.get('/', authenticateToken, postController.getUserFeed);
router.get('/:id', authenticateToken, postController.getPostById);

module.exports = router;

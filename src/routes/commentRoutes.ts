const express = require('express');
const router = express.Router();
import commentsController from '../controllers/commentsController';
import authenticateToken from '../middleware/authenticateToken';

// /comments
router.get('/:id', authenticateToken, commentsController.getCommentsByPostId);
router.post('/:id', authenticateToken, commentsController.commentOnPostById);
router.delete('/:id', authenticateToken, commentsController.deleteCommentById);
router.post(
    '/:id/like',
    authenticateToken,
    commentsController.toggleLikeComment
);
module.exports = router;

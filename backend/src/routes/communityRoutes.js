const express = require('express');
const router = express.Router();
const {
    createCommunity,
    getCommunity,
    getAllCommunities,
    getSimilarCommunities,
    updateCommunity,
    deleteCommunity,
    joinCommunity,
    leaveCommunity,
    addReview
} = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllCommunities);
router.get('/:communityId', getCommunity);
router.get('/:communityId/similar', getSimilarCommunities);

// Protected routes
router.post('/', authMiddleware, createCommunity);
router.put('/:communityId', authMiddleware, updateCommunity);
router.delete('/:communityId', authMiddleware, deleteCommunity);
router.post('/:communityId/join', authMiddleware, joinCommunity);
router.post('/:communityId/leave', authMiddleware, leaveCommunity);
router.post('/:communityId/reviews', authMiddleware, addReview);

module.exports = router;


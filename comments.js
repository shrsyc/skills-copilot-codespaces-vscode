// Create web server

// Dependencies
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Comment, User, Post } = require('../models');
const { asyncHandler, csrfProtection, csrfError } = require('../utils');
const { requireAuth } = require('../auth');

// GET /comments
router.get('/', asyncHandler(async (req, res) => {
    const comments = await Comment.findAll({
        include: [{
            model: User,
            as: 'commenter'
        }]
    });
    res.json(comments);
}));

// GET /comments/:id
router.get('/:id', asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.id, {
        include: [{
            model: User,
            as: 'commenter'
        }]
    });
    res.json(comment);
}));

// POST /comments
router.post('/', csrfProtection, asyncHandler(async (req, res) => {
    const { comment, userId, postId } = req.body;
    const newComment = await Comment.create({ comment, userId, postId });
    res.json(newComment);
}));

// PUT /comments/:id
router.put('/:id', csrfProtection, asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.id);
    await comment.update(req.body);
    res.json(comment);
}));

// DELETE /comments/:id
router.delete('/:id', asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.id);
    await comment.destroy();
    res.json(comment);
}));

module.exports = router;
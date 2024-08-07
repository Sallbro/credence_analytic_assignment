const express = require('express');
const { body, validationResult } = require('express-validator');
const Movie = require('../models/movie');
const router = express.Router();

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// create new movie
router.post('/movies',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('img').isURL().withMessage('Image must be a valid URL'),
    body('summary').notEmpty().withMessage('Summary is required'),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { name, img, summary } = req.body;
    try {
      const newMovie = new Movie({ name, img, summary });
      await newMovie.save();
      res.status(201).json(newMovie);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// read all movies
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// read a single movie
router.get('/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// update a movie
router.put('/movies/:id',
  [
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('img').optional().isURL().withMessage('Image must be a valid URL'),
    body('summary').optional().notEmpty().withMessage('Summary is required'),
  ],
  handleValidationErrors,
  async (req, res) => {
    const { id } = req.params;
    const { name, img, summary } = req.body;
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        id,
        { name, img, summary },
        { new: true, runValidators: true }
      );
      if (!updatedMovie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      res.json(updatedMovie);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

// delete a movie
router.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMovie = await Movie.findByIdAndDelete(id);
    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

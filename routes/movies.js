const express = require("express");
const router = express.Router();

// Models
const Movie = require("../models/Movie");

// Hangi film hangi yönetmene ait
router.get("/", (req, res) => {
  const promise = Movie.aggregate([
    {
      $lookup: {
        from: "directors",
        localField: "director_id",
        foreignField: "_id",
        as: "director"
      }
    },
    {
      $unwind: "$director"
    }
  ]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });

});

// Top 10 List
router.get("/top10", (req, res) => {
  const promise = Movie.find({ }).limit(10).sort({ imdb_score: -1 });

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// 2
router.get("/:movie_id", (req, res, next) => {
  const promise = Movie.findById(req.params.movie_id);
  
  promise.then((movie) => {
    if (!movie)
      next({ message: "Film bulunamadı", code: 99 });

    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});


// 3
router.put("/:movie_id", (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(
    req.params.movie_id, 
    req.body,
    {
      new: true
    }
  );

  promise.then((movie) => {
    if(!movie)
      next({ message: "Film bulunamadı", code: 99 });
    
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});


// 4
router.delete("/:movie_id", (req, res, next) => {
  const promise = Movie.findByIdAndRemove(req.params.movie_id);

  promise.then((movie) => {
    if (!movie)
      next({ message: "Film bulunamadı", code: 99 });

    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });
});


// 1
router.post("/", (req, res, next) => {
  // const { title, imdb_score, category, country, year } = req.body;

  const movie = new Movie(req.body);
  const promise = movie.save();

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });

});

// Between
router.get("/between/:start_year/:end_year", (req, res) => {
  const { start_year, end_year } = req.params;
  const promise = Movie.find(
    { 
      year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }
    }
  );

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

module.exports = router;

/*movie.save((err, data) => {
  if (err)
    res.json(err);

  // res.json(data);
  res.json({ status: 1 });  
});*/
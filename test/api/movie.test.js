const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../../app');

chai.use(chaiHttp);

let token, movieId;

describe("/api/movies Testler", () => {
  
  before((done) => {
    chai.request(server)
      .post('/authenticate')
      .send({ username: "enbiyacan55", password: "11111" })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  describe("/GET Filmler", () => {
    it("Tüm filmleri döndürürmeli", (done) => {
      chai.request(server)
        .get('/api/movies')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  describe("/POST Film", () => {
    it("Bir film getirmeli", (done) => {
      const movie = {
        title: "Test",
        director_id: "5bc9814ce1d4ac432caa998a",
        category: "Komedi",
        country: "Türkiye",
        year: 1950,
        imdb_score: 8
      }

      chai.request(server)
        .post('/api/movies')
        .send(movie)
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title");
          res.body.should.have.property("director_id");
          res.body.should.have.property("category");
          res.body.should.have.property("country");
          res.body.should.have.property("year");
          res.body.should.have.property("imdb_score");
          movieId = res.body._id;
          done();
        });
    });

  });
  
  describe("/GET/:director_id Film", () => {
    it("Eşleşen id ile filmi getirmeli", (done) => {
      chai.request(server)
        .get("/api/movies/" + movieId )
        .set("x-access-token", token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("title");
          res.body.should.have.property("director_id");
          res.body.should.have.property("category");
          res.body.should.have.property("country");
          res.body.should.have.property("year");
          res.body.should.have.property("imdb_score");
          res.body.should.have.property("_id").eql(movieId);
          done();
        });
    });
  });

  describe('/PUT/:movie_id Film', () => {
		it('Bir film güncellenmeli', (done) => {
			const movie = {
				title: '93creative',
				director_id: '5a34e1afb8523a78631f8541',
				category: 'Suç',
				country: 'Fransa',
				year: 1970,
				imdb_score: 9
			};

			chai.request(server)
				.put('/api/movies/' + movieId)
				.send(movie)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('title').eql(movie.title);
					res.body.should.have.property('director_id').eql(movie.director_id);
					res.body.should.have.property('category').eql(movie.category);
					res.body.should.have.property('country').eql(movie.country);
					res.body.should.have.property('year').eql(movie.year);
					res.body.should.have.property('imdb_score').eql(movie.imdb_score);

					done();
				});
		});
  });

  describe('/DELETE/:movie_id Film', () => {
		it('Bir film silinmeli', (done) => {
			chai.request(server)
				.delete('/api/movies/' + movieId)
				.set('x-access-token', token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					// res.body.should.have.property('status').eql(1);
					done();
				});
		});
  });

});
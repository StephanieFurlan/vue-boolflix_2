

var app = new Vue({
   el: "#app",
   data: {
      // api key
      api_key: 'c83d5b0ca913b3248c9aae55239316fc',

      // search input
      showSearchInput: false,
      inputBarStyle: '',
      inputStyle: '',
      query: '',

      // genre
      selectedGenre: 'all',
      genreNames: [],
      genreIds: [],

      // menu
      isHome: true,
      isMovie: false,
      isTv: false,
      isTop: true,

      //images
      cardUrl: 'https://image.tmdb.org/t/p/w342',
      postersUrl: 'https://image.tmdb.org/t/p/original/',
      // top20movies
      top20Movies: [],
      top20MoviesPointer: 0,
      top20MoviesLeft: 0,

      // top20Tvs
      top20Tvs: [],

      top20TvsPointer: 0,
      top20TvsLeft: 0,

      rowLayout: true,
      // movies
      selectedMovies: [],
      // tvShows
      selectedTv: []



   },
   methods: {
      toggleInput() {
         this.showSearchInput = !this.showSearchInput;
         // change search bar style
         this.inputBarStyle = '';
         if (this.showSearchInput) {
            this.inputBarStyle = 'inputBarStyle';
            this.inputStyle = 'inputStyle';
         }
      },
      setRowLayout() {
         this.rowLayout = true;
      },
      setGridLayout() {
         this.rowLayout = false;
      },
      showOnlyMovies() {
         this.isMovie = true;
         this.isHome = false;
         this.isTv = false;
         this.rowLayout = false;
         this.selectedGenre = 'all';
         this.getMovies("https://api.themoviedb.org/3/movie/popular?", 1);
      },
      showHome() {
         this.isMovie = false;
         this.isHome = true;
         this.isTv = false;
         this.rowLayout = true;
         this.isTop = true;
         this.selectedGenre = 'all';
      },
      showOnlyTvs() {
         this.isMovie = false;
         this.isHome = false;
         this.isTv = true;
         this.rowLayout = false;
         this.selectedGenre = 'all';
         this.getTvs("https://api.themoviedb.org/3/tv/popular?", 1);
      },
      search() {
         if (this.query != '') {
            //searchMovies
            this.getMovies('https://api.themoviedb.org/3/search/movie?', 1);
            // search tv shows
            this.getTvs('https://api.themoviedb.org/3/search/tv?', 1);

         } else {
            this.getMovies("https://api.themoviedb.org/3/movie/popular?", 1);
            this.getTvs("https://api.themoviedb.org/3/tv/popular?", 1);
         }
         this.selectedGenre = 'all';

         if (this.isHome && this.isTop) {
            this.isTop = false;
         }

         console.log(this.query);
      },
      getTop20Movies() {
         axios.get('https://api.themoviedb.org/3/movie/popular?', {
            params: {
               api_key: this.api_key
            }
         }).then(res => {
            var movies = [];
            res.data.results.forEach(movie => {

               var cast = [];
               axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?`, {
                  params: {
                     api_key: this.api_key
                  }
               }).then(res => {

                  res.data.cast.slice(0,6).forEach(person => {
                     cast.push(person.name);
                  });
                  movie.cast = cast.toString();
                  movies.push(movie);
                  this.top20Movies = movies;
                  this.top20MoviesPointer = this.top20Movies.length - 4;
               })
            })
         })
      },
      getTop20Tvs() {
         axios.get('https://api.themoviedb.org/3/tv/popular?', {
            params: {
               api_key: this.api_key
            }
         }).then(res => {
            var movies = [];
            res.data.results.forEach(movie => {

               var cast = [];
               axios.get(`https://api.themoviedb.org/3/tv/${movie.id}/credits?`, {
                  params: {
                     api_key: this.api_key
                  }
               }).then(res => {

                  res.data.cast.slice(0,6).forEach(person => {
                     cast.push(person.name);
                  });
                  movie.cast = cast.toString();
                  movies.push(movie);
                  this.top20Tvs = movies;
                  this.top20TvsPointer = this.top20Tvs.length - 4;
               })
            })
         })
      },
      getMovies(movieApi, page) {
         axios.get(movieApi, {
            params: {
               api_key: this.api_key,
               query: this.query,
               page: page
            }
         }).then(res => {
            var movies = [];
            res.data.results.forEach(movie => {

               var cast = [];
               axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?`, {
                  params: {
                     api_key: this.api_key
                  }
               }).then(res => {

                  res.data.cast.slice(0,6).forEach(person => {
                     cast.push(person.name);
                  });
                  movie.cast = cast.toString();
                  movies.push(movie);
                  this.selectedMovies = movies;
               })
            })
         });
      },
      getTvs(tvApi, page) {
         axios.get(tvApi, {
            params: {
               api_key: this.api_key,
               query: this.query,
               page: page
            }
         }).then(res => {
            var tvs = [];
            res.data.results.forEach(tv => {

               // create movie cast
               var cast = [];
               axios.get(`https://api.themoviedb.org/3/tv/${tv.id}/credits?`, {
                  params: {
                     api_key: this.api_key
                  }
               }).then(res => {
                  res.data.cast.slice(0,6).forEach(person => {
                     cast.push(person.name);
                  });

                  tv.cast = cast.toString();
                  tvs.push(tv);
                  this.selectedTv = tvs;
               })
            })
         });
      },
      moveLeft(type) {
         pointer = this.top20MoviesPointer;
         array = this.top20Movies;
         left = this.top20MoviesLeft;
         if (type == "tv") {
            pointer = this.top20TvsPointer;
            array = this.top20Tvs;
            left = this.top20TvsLeft;
         }
         if( array.length - (pointer + 4) >= 4 )  {
            left += 100;
            pointer += 4;
         } else {
            left += (array.length - (pointer + 4)) * 25;
            pointer = array.length - 4;
         }

         if (type == "tv") {
            this.top20TvsPointer = pointer;
            this.top20TvsLeft = left;
         } else {
            this.top20MoviesPointer = pointer;
            this.top20MoviesLeft = left;
         }
      },
      moveRight(type) {
         pointer = this.top20MoviesPointer;
         array = this.top20Movies;
         left = this.top20MoviesLeft;
         if (type == "tv") {
            pointer = this.top20TvsPointer;
            array = this.top20Tvs;
            left = this.top20TvsLeft;
         }

         if (pointer != 0) {
            if (pointer < 4) {
               if (array.length >= 4) {
                  left -= pointer * 25;
                  pointer = 0;
               }
            } else {
               left -= 100;
               pointer -= 4;
            }
         }

         if (type == "tv") {
            this.top20TvsPointer = pointer;
            this.top20TvsLeft = left;
         } else {
            this.top20MoviesPointer = pointer;
            this.top20MoviesLeft = left;
         }

      },
      getGenre(id) {
         return this.genreNames[this.genreIds.indexOf(id)];
      },
      checkGenre(listIds) {
         if (this.selectedGenre == '' || this.selectedGenre == "all") {
            return true;
         }
         return listIds.includes(this.selectedGenre);
      }
   },
   mounted() {
      // set genres
      axios.all([
         // film
         axios.get('https://api.themoviedb.org/3/genre/movie/list?', {
            params: {
               api_key: this.api_key
            }
         }),
         // serie tv
         axios.get('https://api.themoviedb.org/3/genre/tv/list?', {
            params: {
               api_key: this.api_key
            }
         })
      ])
      .then(axios.spread((obj1, obj2) => {
         var all = obj1.data.genres.concat(obj2.data.genres);
         all.forEach(genre => {
            if (!this.genreNames.includes(genre.name)) {
               this.genreNames.push(genre.name);
               this.genreIds.push(genre.id);
            }
         });
      }));

      this.getTop20Movies();
      this.getTop20Tvs();

   }
})

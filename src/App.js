import React, { useEffect, useState } from "react";

import { Route, Switch, Redirect, useHistory, Link } from "react-router-dom";
import MovieList from "./components/MovieList";
import Movie from "./components/Movie";

import MovieHeader from "./components/MovieHeader";

import FavoriteMovieList from "./components/FavoriteMovieList";

import axios from "axios";
import EditMovieForm from "./components/EditMovieForm";
import AddMovieForm from "./components/AddMovieForm";

const App = (props) => {
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  const [favButtonText, setFavButtonText] = useState(true);

  const { push } = useHistory();

  const deleteMovie = (id) => {
    axios
      .delete(`http://localhost:9000/api/movies/${id}`)
      .then((res) => {
        console.log(res);
        setMovies(res.data);

        const favMovie = favoriteMovies.filter((movie) => movie.id !== id);
        setFavoriteMovies(favMovie);
      })
      .catch((err) => {
        console.log(err);
      });
    // const filteredMovies = movies.filter((movie) => movie.id !== id);
    // setMovies(filteredMovies);
    push(`/`);
  };

  const addToFavorites = (id) => {
    // const favMovie = movies.filter((movie) => movie.id === id)[0];
    const favMovie = movies.find((movie) => movie.id === id);
    if (!favoriteMovies.find((movie) => movie.id === id)) {
      setFavoriteMovies([...favoriteMovies, favMovie]);
      setFavButtonText(false);
    } else {
      const favMovie = favoriteMovies.filter((movie) => movie.id !== id);
      setFavoriteMovies(favMovie);
      setFavButtonText(true);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:9000/api/movies")
      .then((res) => {
        setMovies(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <Link to="/movies">
        <nav className="bg-zinc-800 px-6 py-3">
          <h1 className="text-xl text-white">HTTP / CRUD Film Projesi</h1>
        </nav>
      </Link>
      <div className="max-w-4xl mx-auto px-3 pb-4">
        <MovieHeader />
        <div className="flex flex-col sm:flex-row gap-4">
          <FavoriteMovieList favoriteMovies={favoriteMovies} />

          <Switch>
            <Route path="/movies/edit/:id">
              <EditMovieForm setMovies={setMovies} />
            </Route>

            <Route path="/movies/add">
              <AddMovieForm setMovies={setMovies} />
            </Route>

            <Route path="/movies/:id">
              <Movie
                deleteMovie={deleteMovie}
                addToFavorites={addToFavorites}
                favoriteMovies={favoriteMovies}
                favButtonText={favButtonText}
                setFavButtonText={setFavButtonText}
              />
            </Route>

            <Route path="/movies">
              <MovieList movies={movies} />
            </Route>

            <Route path="/">
              <Redirect to="/movies" />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "./axios";
import './Row.css';
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original";

const Row = ({ title, fetchUrl,isLargeRow }) => {
    const [movies, setMovies] = useState([]);
    const [trailerUrl,setTrailerUrl]=useState("");

    useEffect(() => {
        // if [], run once while loading
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };

    // console.table(movies);

    const handleClick= (movie) => {
        if(trailerUrl){
            setTrailerUrl("");
        }else {
            movieTrailer(movie?.name || "")
            .then(url => {
              const urlParams=new URLSearchParams(new URL(url).search);
              setTrailerUrl(urlParams.get("v"));
              console.log(trailerUrl);
            })
            .catch(error => console.log(error));
        }
    };
    return (
        <div className="row">

            <h2>{title}</h2>

            <div className="row__posters">
                {
                    movies.map((movie) => (
                        <img
                            key={movie.id}
                            onClick={() => handleClick(movie)}
                            className={`row__poster ${isLargeRow  && "row__posterLarge"}`}
                            src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} />
                    ))
                }
            </div>
            {/* <YouTube videoId="YQ1vN_91KO0" opts={opts} /> */}
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}

export default Row;
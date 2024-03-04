"use client";

import { useEffect, useState } from "react";
import { useColor } from "color-thief-react";
import { Movie } from "@/types";
import { formatDate, formatMinutes, shouldTextBeWhite } from "@/lib/helpers";

interface HeroProps {
  movie: Movie;
}

const Hero: React.FC<HeroProps> = ({ movie }) => {
  const [color, setColor] = useState<number[]>([]);
  const [textColor, setTextColor] = useState<"white" | "black">("white");
  const [isDesktop, setIsDesktop] = useState(true);

  const { data, loading, error } = useColor(
    `https://media.themoviedb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`,
    "rgbArray",
    {
      crossOrigin: "anonymous",
    }
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (data) {
      setColor(data);
    }
  }, [data, loading, error]);

  useEffect(() => {
    setTextColor(shouldTextBeWhite(color) ? "black" : "white");
  }, [color]);

  const desktopStyle = {
    backgroundImage: `url('https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${movie.backdrop_path}')`,
  };

  const mobileStyle = {
    backgroundImage: `url('https://media.themoviedb.org/t/p/original${movie.poster_path}')`,
  };

  return (
    <section
      className={
        textColor === "white"
          ? "w-full bg-cover bg-no-repeat text-white"
          : "w-full bg-cover bg-no-repeat text-neutral-900"
      }
      style={isDesktop ? desktopStyle : mobileStyle}
    >
      <div
        className='w-full'
        style={{
          backgroundImage: `linear-gradient(to right, rgba(${color[0]}, ${color[1]}, ${color[2]}, 1) calc((50vw - 170px) - 340px), rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.84) 50%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.84) 100%)`,
        }}
      >
        <div className='flex justify-center items-center p-10 pt-32'>
          <div className='w-[300px] h-[450px] min-w-[300px] rounded-lg overflow-hidden object-contain mr-10 hidden md:flex'>
            <img
              src={`https://media.themoviedb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`}
            />
          </div>
          <div className='flex flex-col gap-4 items-start justify-center'>
            <h2 className='flex text-2xl'>
              <span>{movie.title}</span>
              <span>({movie.release_date.split("-")[0]})</span>
            </h2>
            <div className='flex flex-col gap-2 lg:gap-6 md:flex-row'>
              <span>{movie.release_date}</span>

              <div className='flex gap-2 lg:list-item'>
                {movie.genres.map((genre, index) => {
                  if (index === movie.genres.length - 1) {
                    return <span key={genre.id}>{genre.name}</span>;
                  }
                  return <span key={genre.id}>{genre.name}, </span>;
                })}
              </div>
              <span className='flex gap-1 items-center justify-start lg:list-item'>
                {formatMinutes(movie.runtime)}
              </span>
            </div>
            <p className='italic'>{movie.tagline}</p>
            <p className='text-lg font-bold'>Overview</p>
            <p>{movie.overview}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

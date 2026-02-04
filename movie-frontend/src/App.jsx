import { useState } from "react";
import axios from 'axios'; //backend call garna

export default function App(){
  const [query, setQuery] = useState(''); //url bata movie store garna
  const [movies, setMovies] = useState([]); //api le pathako movie store garna
  const [loading, setLoading] = useState(false); //load huda kehi dekhauna
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [history, setHistory] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null); //trailer ko lagi
  const handleSearch = async () => {
    if(!query) return;
    if(!history.includes(query)){
      setHistory([query,...history].slice(0,5));
    }
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/search-real-movies?title=${query}`);
      setMovies(response.data);
    }catch(error){
      console.error("Connection failed");      
    }
    setLoading(false);
  };
  const handleKeyDown = (e)=>{
    if(e.key === 'Enter'){
      handleSearch();
    }
  }

   //Trailer ko lagi
  const handleMovieClick = async(movie)=>{
    setSelectedMovie(movie);
    setTrailerKey(null);
    try{
      const response = await axios.get(`http://localhost:3000/movie/${movie.id}/videos`);
      setTrailerKey(response.data||false);
    }catch(err){
      console.log("no trailer found");
      setTrailerKey(false);
    }
  }

  const MovieModal = ({movie, onClose}) => {
    if(!movie) return null;
    return (
     <div
  className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm px-4 py-8 flex justify-center"
  onClick={onClose}
>
  <div
    className="relative bg-gray-900 border border-gray-700 max-w-4xl w-full rounded-2xl shadow-2xl
               flex flex-col md:flex-row
               max-h-[calc(100vh-4rem)]
               overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
    {/* Poster */}
    <div className="md:w-1/2 flex-shrink-0">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-72 md:h-full object-cover"
      />
    </div>

    {/* Scrollable Content */}
    <div className="md:w-1/2 p-8 overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-200 font-bold hover:text-white transition"
        aria-label="Close modal"
      >
        ✕
      </button>

      <h2 className="text-3xl font-extrabold uppercase mb-3 tracking-wide">
        {movie.title}
      </h2>

      <div className="flex items-center gap-4 mb-5">
        <span className="text-yellow-400 font-bold text-lg">
          ⭐ {movie.rating}
        </span>
        <span className="text-gray-500">•</span>
        <span className="text-gray-400">{movie.genre}</span>
      </div>

      <p className="text-gray-200 leading-relaxed mb-8">
        {movie.summary}
      </p>
      {trailerKey ? (
        <div className="mt-4 aspect-video">
          <iframe src={`https://www.youtube.com/embed/${trailerKey}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full rounded-lg" title="Youtube video Player"></iframe>
        </div>
      ):(
        <button disabled={trailerKey===null} className= {`mt-6 w-full py-3 rounded-lg font-bold transition-all ${trailerKey === false ? 'bg-gray-800 text-gray-500':'bg-red-600 text-white'}`} >
          {trailerKey === null ? "Searching for Trailer...": "No Trailer Available"}
        </button>
      )}
      
    </div>
  </div>
</div>
    )
  }
 

  return (
    <div className="min-h-screen p-8 font-sans bg-black text-white">
        <aside className="w-full md:w-64 bg-gray-900/50 p-6 rounded-2xl border border-gray-800 h-fit">
          <h3 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">Recent Searches</h3>
          <div className="flex flex-col gap-2">
            {history.length === 0 && <p className="text-gray-600 text-sm">No history yet...</p> }
            {history.map((item,index)=>(
              <button className="text-left p-2 rounded-lg hover:bg-blue-600/2 hover:text-blue-400 transition colors text-gray-300 truncate" key={index} onClick={()=>{setQuery(item);}}>{item}</button>
            ))}
          </div>
        </aside>
      <main className="flex-1">
        <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Movie</h1>
        <div className="flex gap-2">
          <input type="text" className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500" placeholder="Search your favorite movie" onChange={(e)=>setQuery(e.target.value)} onKeyDown={handleKeyDown}/>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-bold transition-all" onClick={handleSearch}> {loading?'Searching...':'Search'} </button>
        </div>
        {movies.length===0 && !loading && (
            <div className="text-center mt-20 text-gray-500 italic">Enter a movie to search</div>
          )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div className="p-2" key={movie.id} onClick={()=>handleMovieClick(movie)}>
            <div className="group relative overflow-hidden rounded-lg shadow-lg bg-gray-900" >
            <div>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="h-[400px] w-full object-cover transition-transform duration-300 group-hover:scale-110" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black-40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <h3 className="text-white font-bold text-lg">{movie.title}</h3>
              <p className="text-yellow-400 text-sm"> ✨{movie.rating} </p>
              <button className="mt-2 w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 font-bold rounded backdrop-blur-md transition" onClick={()=>setSelectedMovie(movie)}>Details</button>
            </div>
          </div>
          <div className="mt-3 px-1">
              <h3 className="text-white font-semibold loading-tight">{movie.title}</h3>
              <p className="text-gray-200 text-sm"> {movie.genre} </p>
            </div>
          </div>
        ))}
        <MovieModal movie={selectedMovie} onClose={()=>setSelectedMovie(null)} />
      </div>
      </main>
    </div>
  );
}
const express = require('express'); //yesle express lai lera aau bhanera bhanxa
const axios = require('axios');
const cors = require('cors');

require('dotenv').config();

const app = express(); //yele server create garxa
const PORT = 3000; //hamro PORT through which server sanga connect hunxa

app.use(cors()); //it tells the server that it is ok to talk with other ports

app.get('/search-real-movies',async(req,res)=>{
    const movieTitle = req.query.title;
    const genreMap = {28:"Action",12:"Adventure",16:"Animation",35:"Comedy",80:"Crime",99:"Documentary",18:"Drama",10751:"Family",14:"Fantasy",36:"History",27:"Horror",10402:"Music",9648:"Mystery",10749:"Romance",878:"Science Fiction",10770:"TV Movie",53:"Thriller",10752:"War",37:"Western"};
    const my_KEY = process.env.TMDB_KEY;
    try{
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${my_KEY}&query=${movieTitle}`);
        const cleanMovies = response.data.results.map(m=>({
            title:m.title,
            genre: m.genre_ids.map(id => genreMap[id]).join(", "),
            rating:m.vote_average,
            summary:m.overview,
            poster_path:m.poster_path
        }));
        res.json(cleanMovies);
    }catch(error){
        res.status(500).json({message:"Failed to fetch"});
    }
})

app.listen(PORT,()=>{
    console.log(`Server running at: ${PORT}`);
});
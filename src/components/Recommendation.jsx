import React, { useContext, useEffect, useState } from 'react'
import { EmotionContext } from '../App'

// let {emotion}=useContext(EmotionContext)
let API_KEY = import.meta.env.VITE_TMDB_API_KEY
const Recommendation = ({}) => {
  let {emotion}=useContext(EmotionContext)
  let [movie,setMovie]=useState([])
  let genreMap={
    happy:35,  // comedy
    sad:18,    // drama
    angry:28, //action
    surprised:12, //adventure
    neutral:null // trending
  }
  let [trailer,setTrailer] = useState(null)

  let getTrailer = async (movieId) => {
    let res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`)
    let data = await res.json()

    let trail= data.results.find(
      (vid)=>vid.type === 'Trailer'&& vid.site === "YouTube"
    )
    if (trail){
      setTrailer(trail.key)
    }
  }


  useEffect(() => {
    if(!emotion||emotion=='Face not detected')return
    let fetchMovie = async () => {
      
      let url=''
      let page = Math.floor(Math.random() * 5) + 1
      if (genreMap[emotion] !== null){
        url=`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreMap[emotion]}&sort_by=popularity.desc&page=${Math.floor(Math.random()*5)+1}`      }
      else{
        url=`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`
      }
      if (emotion === "sad") {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=KEY&with_genres=18&sort_by=vote_average.desc&page=2`
      }
      let res=await fetch(url)
      let data= await res.json()

      if (data && data.results) {
        setMovie(data.results.slice(0,5))
      }

    }
    fetchMovie()
  }, [emotion])
  // let recommendation={
  //   happy: "Play some energetic music 🎵",
  //   sad: "Try listening to relaxing songs 🎧",
  //   angry: "Calm down with soft music 🌿",
  //   surprised: "Watch an exciting movie 🎬",
  //   neutral: "Listen to trending songs 🔥"
  // }
  return (
    <div className='bg-gray-900 text-white p-6 min-h-screen'>
      <h2 className='text-3xl font-bold mb-6 text-center'> 🎬Recommendation : </h2>
      {/* <p> {emotion ? recommendation[emotion]||"No Recommendation available":"Detected emotion to get recommendation"} </p> */}
      {/* <p>Emotion : {emotion}</p> */}
      <div className='flex gap-6 overflow-x-auto scrollbar-hide p-2' style={{display:'flex',gap:'4em',flexWrap:'wrap'} }>
        {movie.map(movie => {
          return <div key={movie.id} onClick={() => getTrailer(movie.id)} className="min-w-[150px] bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-red-500/50 transform hover:scale-110 transition duration-300">
            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} width='120' className='w-full h-[220px] object-cover' alt="" />
            <div className='p-2'>
              <p className='text-sm font-semibold text-center'>Movie For You : {movie.title} </p>
            </div>
          </div>
        })}
      </div>
      {
        trailer &&(
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="relative w-[80%] max-w-3xl">
              <button onClick={()=>setTrailer(null) } className="absolute top-[-40px] right-0 text-white text-xl">❌ Close</button>
              <iframe src={`https://www.youtube.com/embed/${trailer}`} title='Trailer' allowFullScreen frameborder="0"></iframe>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Recommendation
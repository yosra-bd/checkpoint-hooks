const express = require ('express')
const cors = require('cors')
const fs = require('fs').promises
const path = require('path')

const app = express()
const PORT = 3001

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(express.static('public'))


const movieFilePath = path.join(__dirname,'public','Movies.json')

app.get('/', async (req,res)=>{
    try{
        const data = await fs.readFile(movieFilePath,{encoding:'utf8'})
        res.status(200).json(JSON.parse(data))

    }catch(error){
            res.status(500).send({error :'failed to fetch movies', details : error.message})
    }

})


app.post('/', async (req,res)=>{
    try {
        const data = await fs.readFile(movieFilePath,{encoding:'utf8'})
        const movies = JSON.parse(data)
        const newMovie = {...req.body, id : movies.length ? movies[movies.length -1].id + 1 : 1 } 

        movies.push(newMovie)

        await fs.writeFile(movieFilePath,JSON.stringify(movies,null,2),{encoding:'utf8'})
        res.status(201).send({message:'Movie added successfully',movie:newMovie})
    } catch (error) {
        res.status(500).send({error: 'Failed to add movie', details: error.message})
    }
})

app.delete('/:id', async (req,res) => {
    try {
        const data = await fs.readFile(movieFilePath,{encoding:'utf8'})
        const movies = JSON.parse(data)
        const movieIndex = movies.findIndex((movie)=> movie.id === parseInt(req.params.id,10))
            if (movieIndex === -1 ){
                return (
                res.status(404).send({error : ' Movie not found'})
            
)}
        movies.splice(movieIndex,1)
        await fs.writeFile(movieFilePath,JSON.stringify(movies,null,2),{encoding:'utf8'})
        res.status(200).send({message:'Movie deleted succussfully'})
    } catch (error) {
        res.status(500).send({error : 'Failed to delete movie', details : error.message})
    }
})

app.listen(PORT,()=>{console.log(`app is running on port : ${PORT}`)})
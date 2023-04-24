require("dotenv").config()
const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie } = require("./middleware/authentication")

const Blog = require('./models/blog')
const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')



const app = express()
const PORT = process.env.PORT

mongoose.connect(process.env.MONGO_URL).then((e)=> console.log("Mongo DB connected"))
 
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')))
app.use( express.static( "public" ) );


app.get('/', async (req,res) => {
    const allBlogs = await Blog.find({})
    res.render("home",{
        user: req.user,
        blogs:allBlogs
    });
})

app.use('/user',userRoute)
app.use('/blog',blogRoute)
app.listen(PORT,() => console.log(`Server started on port:${PORT}`))
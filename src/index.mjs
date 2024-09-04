import express, { response } from 'express';
import routes from './routes/index.mjs'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUsers } from './utils/constants.mjs';
import passport from 'passport';
import "./strategies/localStrategy.mjs"
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';


const PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost/tutorial")
  .then(()=> console.log("Conectado a la base de datos"))
  .catch((err)=>console.log(err))

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  session({
    secret: "Cristian el desarrolador",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
    store: MongoStore.create({ client: mongoose.connection.getClient() }),
  })
);

app.use(passport.initialize())
app.use(passport.session())

app.use(routes)

app.post("/api/auth",passport.authenticate('local'),(req,res)=>{
  res.status(200).send("Succesfull login")
})

app.get("/api/auth/status",(req,res)=>{
  console.log(req.user)
  if (req.user) {
    return res.status(200).send(req.user)
  }
  return res.sendStatus(401)
})

app.post("/api/auth/logout",(req,res)=>{
  if (!req.user) {
    return res.sendStatus(401)
  }

  req.logOut((err)=>{
    if (err) {
      return res.sendStatus(400)
    }
    res.sendStatus(200)
  })
})

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
})


app.get('/',(request,response) => {
    console.log(request.session)
    console.log(request.session.id)
    request.session.visited = true;
    response.cookie('primera','cookie', {maxAge:60000*60})
    response.status(201).send({msg:'Hola Mundo'})
})

app.post("/api/auth", (req, res) => {
  const {
    body: { userName, password },
  } = req;

  const findUser = mockUsers.find(
    user => user.userName === userName
  )

  if(!findUser || findUser.password !== password ) 
    return res.status(401).send({msg:"Wrong Credentials"})

  req.session.user = findUser;

  return res.status(200).send(findUser)
 
});

app.get('/api/auth/status',(req,res)=>{

  req.sessionStore.get(req.sessionID,(err,session)=>{
    console.log(session)
  })

  if (req.session.user === undefined) 
    return res.status(401).send({msg:"not authenticated"})

  return res.status(200).send(req.session.user )
})

app.post('/api/cart',(req,res)=>{
  if (!req.session.user) res.status(401).send({msg:"not authenticated"})
  
  const { body:item } = req

  const { cart } = req.session

  if (cart) {
    cart.push(item)
  }else{
    req.session.cart =[item]
  }

  return res.status(201).send(item)
})

app.get('/api/cart',(req,res)=>{
  if (!req.session.user) res.status(401).send({msg:"not authenticated"})
  return res.send(req.session.cart?? [])
})
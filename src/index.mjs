import express, { response } from 'express';
import routes from './routes/index.mjs'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { mockUsers } from './utils/constants.mjs';


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret:'Cristian el desarrolador',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:60000 * 60 
    }
}))

app.use(routes)


const PORT = process.env.PORT || 3000;





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

  const findUser = mockUsers.find(user => user.userName === userName)

  if(!findUser || findUser.password !== password ) return res.status(401).send({msg:"Wrong Credentials"})

  req.session.user = findUser;

  return res.status(200).send(findUser)
 
});

app.get('/api/auth/status',(req,res)=>{
  console.log(req.session)
  if (req.session.user === undefined) return res.status(401).send({msg:"not authenticated"})
  return res.status(200).send(req.session.user )
})

app.post('/api/cart',(req,res)=>{
  if (!req.session.user) res.status(401).send({msg:"not authenticated"})
  
  const {body:item} = req

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
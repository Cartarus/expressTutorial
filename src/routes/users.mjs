import { Router } from "express";
import { checkSchema, matchedData, query, validationResult } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { CreateUservalidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByuserId } from "../utils/middlewares.mjs";

const router = Router();





router.get('/api/users',
    query('filter').isString()
    .notEmpty().withMessage('must not be Empty')
    .isLength({min:3,max:10}).withMessage('must be at least 3 to 10 characters')

    ,(req,res)=>{
        console.log(req.session.id)
        req.sessionStore.get(req.session.id,(err,sessionData)=>{
            if (err) {
                console.log(err)
                throw err;
            }
            console.log(sessionData)
        })
        const result = validationResult(req)
        // console.log(result)
        const {
            query:{ filter,value}
        } = req


        if (filter && value) return res.send(
            mockUsers.filter((user)=> user[filter].includes(value))
        )

        // cuando no llega filter ni value
        return res.send(mockUsers)
    }
)

 router.get('/api/users/:id',resolveIndexByuserId,(request,response)=>{
    const {body,findUserIndex} = request


    const findUser = mockUsers[findUserIndex]
    if(!findUser) return response.sendStatus(404)

    return response.send(findUser)
})

router.post('/api/users',
    checkSchema(CreateUservalidationSchema)
     ,
     (req,res)=>{
     const result = validationResult(req)
     console.log(result);
 
     if (!result.isEmpty()) {
         return res.status(400).send({errors:result.array()})
     }
     
     const data = matchedData(req)
     // console.log(data)
     // const {body} = req
     const newUser = {id:mockUsers[mockUsers.length-1].id + 1 ,...data}
     mockUsers.push(newUser)
     return res.status(201).send(newUser)
 }
)

router.put('/api/users/:id',resolveIndexByuserId,(request,response)=>{

    const {body,findUserIndex} = request
    mockUsers[findUserIndex] = { id:mockUsers[findUserIndex].id,...body }

    return response.sendStatus(200)
        
    
})

router.patch('/api/users/:id',resolveIndexByuserId,(request,response)=>{

    const {body,findUserIndex} = request
    
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body,id:mockUsers[findUserIndex].id }

    return response.sendStatus(200)
    
})

router.delete('/api/users/:id',resolveIndexByuserId,(request,response)=>{

    const {body,findUserIndex} = request
    
    mockUsers.splice(findUserIndex,1)

    return response.sendStatus(200)
    
})



export default router;
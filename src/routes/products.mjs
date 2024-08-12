import { Router } from "express";

const router = Router()

router.get('/api/products',(request,response)=>{

    console.log( request.headers.cookie )
    console.log( request.cookies)
    if (request.cookies.primera && request.cookies.primera === 'cookie') {
        response.send([
            {id:'123',name:'alitas de pollo',price:24},
            {id:'123',name:'alitas de pollo',price:24},
            {id:'123',name:'alitas de pollo',price:24},
        ])
    }else{
        response.status(403).send({msg:'you need cookie'})
    }
    
})


export default router
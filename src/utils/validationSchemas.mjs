export const CreateUservalidationSchema = {
    userName:{
        isLength:{
            options:{
                min:5,
                max:32
            },
            errorMessage :'must be at least 5 to 32 characters'
        },
        notEmpty:{
            errorMessage :'UserName Cannot Be Empty'
        },
        isString:{
            errorMessage :'userName must be a String'
        }
    },
    displayName:{
        notEmpty:{
            errorMessage :'displayName Cannot Be Empty'
        }
    },
    password :{
        notEmpty:true
    }
}
import bcrypt from "bcrypt"
import passport from "passport";

const saltRounds = 10; 


export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds)
    console.log(salt)
    return bcrypt.hashSync(password,salt)
}

export const comparePassword  = (plain, hashed) => {
 return bcrypt.compareSync(plain,hashed)
}
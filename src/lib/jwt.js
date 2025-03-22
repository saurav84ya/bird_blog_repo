import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

export function signJwtToken(payload,options={}){
  
    const token  = jwt.sign(payload , secret , options)
    return token
}

export function verifyJwtToken(token) {
    try {
        const payload = jwt.verify(token,secret)
        return payload
    } catch (error) {
        console.log(error)
        return null
    }
}
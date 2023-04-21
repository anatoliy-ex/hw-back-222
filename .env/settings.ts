import {v4 as uuidv4} from 'uuid'

export const settings = {
    MONGO_URI: process.env.mongoURL || "mongodb+srv://flex:Wm6Jo7Gnuy4SCn7l@cluster0.b1gxtc6.mongodb.net/hw2-api-beck?retryWrites=true&w=majority",
    JWT_SECRET: process.env.JWT_SECRET || '34343434',
    EMAIL_CODE: process.env.EMAIL_CODE ||uuidv4(),

}
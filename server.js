import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import {registerValidation} from './validations/auth.js';

mongoose
    .connect('mongodb+srv://admin:admin@cluster0.t4q9pjh.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('BD connected'))
    .catch((err) => console.log(err));

const app = express();

app.use(express.json()); // чтение json

/* Парсим ответ в теле запроса, валидируем, выдаем ошибку или успех */

app.post('/auth/register', registerValidation, (req, res) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }
    res.json({
        registerSuccess: true,
    });
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    
    console.log('server started');
});
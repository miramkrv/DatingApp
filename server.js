import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import {registerValidation} from './validations/auth.js';

import UserModel from './models/Users.js';

mongoose
    .connect('puk')
    .then(() => console.log('BD connected'))
    .catch((err) => console.log(err));

const app = express();

app.use(express.json()); // чтение json

/* Парсим ответ в теле запроса, валидируем, выдаем ошибку или успех */

app.post('/auth/register', registerValidation, async (req, res) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); // алгоритм шифрования пароля
    const passwordHash = await bcrypt.hash(password, salt); // передаем пароль и сам алгоритм шифрования

    const doc = new UserModel({ // подготавливаем документ пользователя
        email:req.body.email,
        fullName:req.body.fullName,
        avatarUrl:req.body.avatarUrl,
        passwordHash,
    });

    const user = await doc.save(); // сохраняем документ пользователя в базу

    res.json(user);
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    
    console.log('server started');
});
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt, { hash } from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import {registerValidation} from './validations/auth.js';

import UserModel from './models/Users.js';

mongoose
    .connect('mongodb+srv://puk:puk@puk.gwhuocd.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('BD connected'))
    .catch((err) => console.log(err));

const app = express();

app.use(express.json()); // чтение json

/* Парсим ответ в теле запроса, валидируем, выдаем ошибку или успех */

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne ({email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: 'Вы не зарегистрированы',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); // сверяем введенный пароль с тем, что есть в базе

        if (!isValidPass) {
            return res.status(403).json({
                message: 'Неверный логин или пароль'
            });
        }

        const token = jwt.sign(
        {
            _id: user._id, 
        }, 
        'zalupa', // сменить шифрование
        {
            expiresIn: '3d', // срок жизни токена
        },
        );

        const {passwordHash, ...userData} = user._doc;
        // Деструктуризация. Ниже в ответе не будем возвращать passwordHash
        res.json({
            ...userData,
            token
        });
    } catch (err) {
        console.log(err) // ошибка для себя
        res.status(500).json({
            message:"Не удалось авторизоваться",
        });
    }
});

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
    const errors = validationResult(req); 
    if (!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); // алгоритм шифрования пароля
    const Hash = await bcrypt.hash(password, salt); // передаем пароль и сам алгоритм шифрования

    const doc = new UserModel({ // подготавливаем документ пользователя
        email:req.body.email,
        fullName:req.body.fullName,
        avatarUrl:req.body.avatarUrl,
        passwordHash: hash,
    });

    const user = await doc.save(); // сохраняем документ пользователя в базу

    const token = jwt.sign({
        _id: user._id, 
    }, 
    'zalupa', // сменить шифрование
    {
        expiresIn: '3d', // срок жизни токена
    },
    );

    const {passwordHash, ...userData} = user._doc;
    // Деструктуризация. Ниже в ответе не будем возвращать passwordHash
    res.json({
        ...userData,
        token
    });
    } catch (err) {
        console.log(err) // ошибка для себя
        res.status(500).json({
            message:"Регистрация не пройдена",
        });
    }
});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    
    console.log('server started');
});
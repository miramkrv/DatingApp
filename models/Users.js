import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true, // обязательно для заполнения
    },
    email: {
        type: true,
        required: true,
        unique: true, // уникальное значение
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String, // необязательно, поэтому не нужно передавать объект - передаем сразу тип.

}, {
    timestamps: true, // дата создания пользователя и дату обновления сущности
},
);

export default mongoose.model('Users', UserSchema); 

// MVC
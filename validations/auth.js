import { body } from 'express-validator';

export const registerValidation = [
    body('email','Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содержать минимум 8 символов').isLength({min: 8}),
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('avatarUrl','Не удалось получить изображение. Проверьте правильность ссылки').optional().isURL(), // опционально (провалидирует, если придет)
];
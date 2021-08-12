import ApiError from "./ApiError";

class AuthValidator{
    static emailValidate(email: string){
        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(email)){
            throw ApiError.badRequest('Некорректный email');
        }
    }

    static passwordValidate(password: string){
        AuthValidator.lengthValidate(password, [6, 32], 'Длина пароля должна быть 6-32 символа');
        if(!(/^(?=.*[a-z])(?=.*\d)[a-z\d!@#$%^&\*]*$/i).test(password)){
            throw ApiError.badRequest('Пароль обязан содержать цифры(0-9) и латинские буквы(a-z, A-Z), а так же может содердать символы !@#$%^&*');
        }
    }

    static nameValidator(name: string){
        AuthValidator.lengthValidate(name, [3, 30], 'Длина имени должна быть 3-30 символов')
        if(!/^(?=.*[a-zа-я]{3}).*$/i.test(name)){
            throw ApiError.badRequest('В имени должны быть минимум три буквы');
        }
    }

    static lengthValidate(subject: string, length: [number, number], message: string){
        if(subject.length < length[0] || subject.length > length[1]){
            throw ApiError.badRequest(message);
        }
    }
}

export default AuthValidator;
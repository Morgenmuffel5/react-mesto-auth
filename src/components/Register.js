import React, {useState} from "react";
import { Link } from 'react-router-dom'
import Header from "./Header";

function Register (props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleEmailUpdate(e) {
        setEmail(e.target.value)
    }
    function handlePasswordUpdate(e) {
        setPassword(e.target.value)
    }
    function createNewAccount() {
        props.onRegister(password, email);
    }
    return (
        <>
            <Header
                title="Вход"
                link="/sign-in"/>
            <div className="login">
                <p className="login__title">
                    Регистрация
                </p>
                <form className="login__form" onSubmit={createNewAccount}>
                    <input placeholder='Email' required id="input-email" className='login__input' name="email" type="text" value={email ||''} onChange={handleEmailUpdate} />
                    <input placeholder='Пароль' required id="input-password" name="password" className='login__input' type="password" value={password || ''} onChange={handlePasswordUpdate} />
                    <div className="login__button-cont">
                        <button type="submit" className="login__button">Войти</button>
                    </div>
                </form>
                <div className="login__cont">
                    <Link to="sign-in" className="login__login-link">
                        Уже зарегистрированы? Войти
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Register;
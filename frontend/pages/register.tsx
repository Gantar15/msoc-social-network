
import type {NextPage} from 'next';
import {useRef, useState, useEffect} from 'react';
import Image from 'next/image';
import Input from '@material-ui/core/Input';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import A from '../components/A/A';
import { useRegister } from '../apollo/mutations/register';
import { useRouter } from 'next/router';

import scss from '../public/styles/register.module.scss';


const Login: NextPage = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const loginRef = useRef<HTMLDivElement>(null);
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const {register, data, error, setError, loading} = useRegister(email, password, repeatPassword, name);
    const router = useRouter();

    const showPassHandler = () => {
        setIsPasswordVisible(isVisible => !isVisible);
    };
    const registerHandler = () => {
        if(!loading){
            register();
        }
    };

    useEffect(() => {
        if(loginRef.current)
            loginRef.current.style.height = loginRef.current.scrollHeight + 'px';
    }, []);
    useEffect(() => {
        if(data){
            router.push('/login');
        }
    }, [data]);
    useEffect(() => {
        if(error)
            setTimeout(() => setError(null), 5500)
    }, [error]);

    return (
        <main className={scss.login} ref={loginRef}>
            <section className={scss.loginLeft}></section>
            <section className={scss.loginRight}>
                <div className={scss.loginBlock}>
                    <div className={scss.logoBlock}>
                        <Image className={scss.logoImage} width="25" height="25" src="/imgs/main_logo.png"></Image>
                        <span>msoc</span>
                    </div>
                    <h1 className={scss.greeting}>
                        Привет,<br/> добро пожаловать
                    </h1>
                    <section className={scss.formBlock}>
                        <span className={scss.title}>
                            Зарегестрируйтесь, чтобы продолжить
                        </span>
                        {error ?
                            (<div className={scss.error}>
                                {error.message}
                            </div>)
                            : false
                        }
                        <div className={scss.form}>
                            <Input onChange={({target}) => setName(target.value)} className={scss.name} autoFocus={true} placeholder={'имя'} classes={{
                                root: scss.root
                            }}/>
                            <Input onChange={({target}) => setEmail(target.value)} className={scss.email} placeholder={'почта'} classes={{
                                root: scss.root
                            }}/>
                            <div className={scss.password}>
                                <Input onChange={({target}) => setPassword(target.value)} placeholder={'пароль'} classes={{
                                    root: scss.root
                                }}
                                inputProps={{
                                    type: isPasswordVisible ? 'text' : 'password'
                                }}/>
                            </div>
                            <div className={scss.repeatPassword}>
                                <Input onChange={({target}) => setRepeatPassword(target.value)} placeholder={'повторите пароль'} classes={{
                                    root: scss.root
                                }}
                                inputProps={{
                                    type: isPasswordVisible ? 'text' : 'password'
                                }}/>
                                <div className={scss.showPass} onClick={showPassHandler}>
                                    {
                                        isPasswordVisible ? <VisibilityOffIcon className={scss.icon}/> 
                                        : <VisibilityIcon className={scss.icon}/>
                                    }
                                </div>
                            </div>
                        </div>
                        <button onClick={registerHandler}>
                            {
                                loading ? (<Image src="/imgs/loading.gif" width="30" height="30"/>) : 'Создать'
                            }
                        </button>
                    </section>
                    <div className={scss.social}>
                        <div className={scss.or}>
                            <div></div>
                            <span>или</span>
                            <div></div>
                        </div>
                        <div className={scss.socialBlock}>
                            <div>
                                <Image className={scss.icon} src="/imgs/google-logo.svg" width="15" height="15"/>
                            </div>
                            <div>
                                <Image className={scss.icon} src="/imgs/facebook-logo.svg" width="15" height="15"/>
                            </div>
                            <div>
                                <Image className={scss.icon} src="/imgs/vk-logo.svg" width="20" height="20"/>
                            </div>
                        </div>
                    </div>
                    <footer>
                        <span>У вас уже есть аккаунт?
                            <A href="/login">
                                <span className={scss.signin}> Войти</span>
                            </A>
                        </span>
                    </footer>
                </div>
            </section>
        </main>
    );
};

export default Login;
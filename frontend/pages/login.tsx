
import type {GetServerSideProps, NextPage} from 'next';
import { useRouter } from 'next/router';
import {useRef, useState, useEffect} from 'react';
import Image from 'next/image';
import Input from '@material-ui/core/Input';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { useLogin } from '../apollo/mutations/login';
import A from '../components/A/A';
import validateRefreshToken from '../utils/validateRefreshToken';

import scss from '../public/styles/login.module.scss';


const Login: NextPage = () => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isRemember, setIsRemember] = useState(false);
    const loginRef = useRef<HTMLDivElement>(null);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const {login, data, error, setError, loading} = useLogin(email, password);
    const router = useRouter();

    const showPassHandler = () => {
        setIsPasswordVisible(isVisible => !isVisible);
    };
    const rememberHandler = () => {
        setIsRemember(val => !val);
    };
    const loginHandler = () => {
        if(!loading){
            login();
        }
    };

    useEffect(() => {
        if(error)
            setTimeout(() => setError(null), 5500)
    }, [error]);
    useEffect(() => {
        if(data){
            router.push('/');
        }
    }, [data]);
    useEffect(() => {
        const loginResizeHandler = () => {
            loginRef!.current!.style.height = loginRef!.current!.scrollHeight + 'px';
        };
        if(loginRef.current){
            window.addEventListener('resize', loginResizeHandler);
            loginRef!.current!.style.height = loginRef!.current!.scrollHeight + 'px';
        }

        return () => {
            window.removeEventListener('resize', loginResizeHandler);
        };
    }, []);

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
                            Авторизуйтесь, чтобы продолжить
                        </span>
                        {error ?
                            (<div className={scss.error}>
                                {error.message}
                            </div>)
                            : false
                        }
                        <div className={scss.form}>
                            <Input onChange={({target}) => setEmail(target.value)} value={email} className={scss.email} autoFocus={true} placeholder={'почта'} classes={{
                                root: scss.root
                            }}/>
                            <div className={scss.password}>
                                <Input onChange={({target}) => setPassword(target.value)} value={password} placeholder={'пароль'} classes={{
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
                        <div className={scss.rememberBlock}>
                            <div className={scss.isRemember} onClick={rememberHandler}>
                                <input onChange={()=>{}} checked={isRemember} type="checkbox" 
                                className={`${scss.remember} ${isRemember ? scss.checked : ''}`}/>
                                <span>запомнить</span>
                            </div>
                            <A href="/forgot" className={scss.forgot}>
                                <span>
                                    Забыли пароль?
                                </span>
                            </A>
                        </div>
                        <button onClick={loginHandler}>
                            {
                                loading ? (<Image src="/imgs/loading.gif" width="30" height="30"/>) : 'Войти'
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
                        <span>У вас еще нет аккаунта?
                            <A href="/register">
                                <span className={scss.signup}> Создать</span>
                            </A>
                        </span>
                    </footer>
                </div>
            </section>
        </main>
    );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async ({req}) => {
    const API_URL = 'http://localhost:7700';
    const result = await validateRefreshToken(API_URL+'/auth/refreshTokenValidate', req.cookies.refreshToken);
    if(result){
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      };
    }
  
    return {
      props: {
      }
    };
};
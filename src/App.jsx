import React from 'react';
import Layout from './ui/global/layout';
import { HashRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import AuthPage from './ui/pages/auth/auth-page';
import UserPage from './ui/pages/createUser/create-user';
import MainPage from './ui/pages/mainPage/main';
import AboutClient from './ui/pages/about-user/about-user';
import ClientSubscriptions from './ui/pages/subscribe-client/subscribe';
import  CreateCompanyPage  from './ui/pages/create-company/company';

const App = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<AuthPage />} />
                    <Route path="about-user/:id" element={<AboutClient />} />
                    <Route path="subscribe/:id" element={<ClientSubscriptions/>}/>
                    <Route path='clients' element={<MainPage/>} />
                    <Route path="create-user" element={<UserPage />} />
                    <Route path="company" element={<CreateCompanyPage />} />
                    <Route path="*" element={<div>Страница не найдена</div>} />
                </Route>
            </Routes>
        </HashRouter>
    );
};


export default App;

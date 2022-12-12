import logo from '../logo.svg';

import avatar from '../images/avatar.jpg'
import React from "react";
import Header from './Header.js'
import Main from './Main.js'
import Footer from "./Footer.js";
import PopupWithForm from "./PopupWithForm.js";
import EditProfilePopup from "./EditProfilePopup.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import ImagePopup from "./ImagePopup.js";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import {api} from '../utils/Api.js'
import {registerApi} from "../utils/RegistrationApi";
import {CurrentUserContext} from '../contexts/CurrentUserContext.js'
import {Route, Switch, useHistory, Redirect} from 'react-router-dom'

function App() {

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({});
    const [deletedId, setDeletedId] = React.useState('');
    const [isDeleterOpen, setIsDeleterOpen] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState({});
    const [cards, setCards] = React.useState([]);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState('');
    const [isOk, setIsOk] = React.useState(false);
    const history = useHistory()

    React.useEffect(() => {
        Promise.all([api.getUserInfo(), api.getInitialCards()])
            .then(([userData, cards]) => {
                setCurrentUser(userData);
                setCards(cards);
            })
            .catch(err => {
                console.log(err)
            });
    }, []);

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);
        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        }).catch(err => {
            console.log(err)
        });
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id).then((deletedCard) => {
            setCards((state) => state.filter(item => item._id !== card._id));
        }).catch(err => {
            console.log(err)
        })
    }

    function handleUpdateUser(userInfo) {
        api.saveNewUserInfo(userInfo).then((response) => {
            setCurrentUser(response);
            closeAllPopups()
        }).catch(err => {
            console.log(err)
        })
    }

    function handleUpdateAvatar(userInfo) {
        api.changeAvatar(userInfo).then((response) => {
            setCurrentUser(currentUser.avatar = response);
            closeAllPopups()
        }).catch(err => {
            console.log(err)
        })
    }

    function handleUpdateCard(cardInfo) {
        api.addNewCard(cardInfo).then((response) => {
            setCards([response, ...cards]);
            closeAllPopups()
        }).catch(err => {
            console.log(err)
        })
    }


    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);

    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleOpenLoginPopup() {
        setIsInfoTooltipPopupOpen(true);
    }
    function handleDeleterClick(cardId) {
        setDeletedId(cardId);
        setIsDeleterOpen(true)
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setSelectedCard({});
        setDeletedId('');
        setIsDeleterOpen(false);
       setIsInfoTooltipPopupOpen(false);
    }

    function handleCardClick(card) {
        setSelectedCard({...selectedCard, name: card.name, link: card.link});
    }

    function handleLogout() {
        localStorage.removeItem('token')
        setUserEmail('')
        setLoggedIn(false)
    }

    //функция регистрации
    function handleCreateAccount(userInfo) {
        registerApi.registrateNewUser(userInfo).then(response => {
            history.push('/sign-in')
            setIsOk(true);
            handleOpenLoginPopup();
        }).catch(error => {
            console.log(error);
            setIsOk(false);
            handleOpenLoginPopup();
        })
    }

    //функция авторизации
    function handleLogin(userInfo) {
        registerApi.logInCurrentUser(userInfo).then(response => {
            if (response.token) {
                localStorage.setItem('token', response.token);
                setLoggedIn(true);
                history.push('/')
            } else {
                setIsOk(false);
                handleOpenLoginPopup();
            }
        }).catch(error => {
            console.log(error);
            setIsOk(false);
            handleOpenLoginPopup();
        })
    }


    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            const token = localStorage.getItem('token')
            console.log(token)
            registerApi.checkToken(token).then((response) => {
                    setUserEmail(response.data.email)
                    setLoggedIn(true)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [])

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <div className="page__content">
                    <Switch>
                        <ProtectedRoute path="/" exact component={() => (
                            <>
                                <Header
                                    title="Выйти"
                                    userEmail={userEmail}
                                    signOut={handleLogout}
                                    linkRoute="/sign-in"
                                />
                                <Main
                                    onEditAvatar={handleEditAvatarClick}
                                    onEditProfile={handleEditProfileClick}
                                    onAddPlace={handleAddPlaceClick}
                                    onCardClick={handleCardClick}
                                    cards={cards}
                                    onCardDelete={handleCardDelete}
                                    onCardLike={handleCardLike}
                                />
                                <Footer/>
                            </>
                        )}
                                        loggedIn={loggedIn}/>

                        <Route path="/sign-up">
                                    <Register onRegister={handleCreateAccount}/>
                        </Route>

                        <Route  path="/sign-in">
                                    <Login onLogin={handleLogin}/>
                        </Route>
                    </Switch>


                    <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups}
                                      onUpdateUser={handleUpdateUser}/>


                    <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}
                                   onUpdateCards={handleUpdateCard}/>


                    <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
                                     onUpdateAvatar={handleUpdateAvatar}/>

                    <PopupWithForm name='delete' title='Вы уверены?' isOpen={isDeleterOpen}
                                   onClose={closeAllPopups}/>

                    <ImagePopup card={selectedCard} onClose={closeAllPopups} name="image"/>

                    <InfoTooltip isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups} isOk={isOk}/>

                </div>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;

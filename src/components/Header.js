
import { Link } from 'react-router-dom'
import React from "react";
import {api} from "../utils/Api";

function Header (props) {

    return(
        <header className="header">
            <a href="src/components/App#" className="header__logo"></a>
            <p className="header__email">{props.userEmail}</p>
            <Link to={props.link} className="header__title" onClick={props.signOut}>
                {props.title}
            </Link>
        </header>

    )
}
export default Header;
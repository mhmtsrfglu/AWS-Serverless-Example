import React from 'react';
import {Navbar, Nav, NavItem} from "react-bootstrap";
import {Link} from "react-router-dom";
import './App.css';
import Routes from "./Routes";
import NavbarButtons from "./Containers/NavbarButtons";

function App() {
    return (
        <div className="App container">
                <Navbar fluid collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">Hello AWS</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                    </Navbar.Header>
                    <NavbarButtons/>
                </Navbar>
                <Routes/>

        </div>
    );
}

export default App;

import React, {useContext, useState, useEffect} from 'react'
import {Nav, NavItem, Navbar} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {Auth} from 'aws-amplify'
import {withRouter} from 'react-router-dom'

const NavbarButtons = (props) => {
    const [session, setSession] = useState(false);
    const [completed, setCompleted] = useState(false);
    const LogoutBtn = async () => {
        await Auth.signOut();
        props.history.push("/login")
    };

    Auth.currentAuthenticatedUser().then(user => setSession(true))
        .catch(err => setSession(false));
    return (
        <>
            {<Navbar.Collapse>
                {!session && <Nav pullRight>
                    <LinkContainer to="/signup">
                        <NavItem>Signup</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/login">
                        <NavItem>Login</NavItem>
                    </LinkContainer>
                </Nav>}
                {session && <Nav pullRight><LinkContainer onClick={LogoutBtn} to="/">
                    <NavItem>Logout</NavItem>
                </LinkContainer></Nav>}
            </Navbar.Collapse>}

        </>
    )
};

export default withRouter(NavbarButtons);
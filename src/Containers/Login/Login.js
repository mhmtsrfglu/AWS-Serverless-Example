import React, {useState, useContext, useEffect} from "react";
import {Button, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import "./Login.css";
import {Auth} from "aws-amplify";

export default function Login(props) {

    const [userinf, setuserinf] = useState({
        username: "",
        password: ""
    })


    function validateForm() {
        return userinf.username.length > 0 && userinf.password.length > 0;
    }

    const handleChange = event => {
        setuserinf({
            ...userinf,
            [event.target.id]: event.target.value
        })
    }

    const handleSubmit = async event => {
        event.preventDefault();
        try {
            await Auth.signIn(userinf.username, userinf.password);
            props.history.push("/");
        } catch (e) {
            alert(e.message);
        }

    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="username" bsSize="large">
                    <ControlLabel>Username</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={userinf.username}
                        onChange={handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        value={userinf.password}
                        onChange={handleChange}
                        type="password"
                    />
                </FormGroup>
                <Button
                    block
                    bsSize="large"
                    disabled={!validateForm()}
                    type="submit"
                >
                    Login
                </Button>
            </form>
        </div>
    );
}
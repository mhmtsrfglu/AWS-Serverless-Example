import React, {useState, useContext} from "react";
import {
    FormGroup,
    FormControl,
    ControlLabel,
    Button,
    HelpBlock
} from "react-bootstrap";
import "./Signup.css";
import {Auth, API} from "aws-amplify";
import Loader from 'react-loader-spinner'
import config from "../../config";
import {s3Upload} from "../../libs/AWSLibs";


export default function Signup(props) {

    const [session, setSession] = useState({
        isLoading: false,
        email: "",
        password: "",
        username: "",
        name: "",
        surname: "",
        school: "",
        profilePhoto: "",
        confirmPassword: "",
        confirmationCode: "",
        newUser: null,
        confirmationArea: false
    });
    const [confirmation, setConfirmation] = useState(false);
    const [completed, setCompleted] = useState(true);


    const handleChange = event => {
        setSession({
            ...session,
            [event.target.id]: event.target.value
        })
    };
    const handleSubmit = async event => {
        setCompleted(false);
        setSession({
            ...session,
            isLoading: true
        });

        try {
            const newUser = await Auth.signUp({
                username: session.username,
                password: session.password,
                attributes: {email: session.email}
            });

            setSession({
                ...session,
                newUser: newUser,
            });
            setConfirmation(true)
        } catch (e) {
            alert(e.message);
        }

        setCompleted(true);

    };

    function validateConfirmationForm() {
        return session.confirmationCode.length > 0;
    }

    const handleConfirmationSubmit = async event => {
        event.preventDefault();

        setCompleted(false);

        if (session.file && session.file.size > config.MAX_ATTACHMENT_SIZE) {
            alert(`Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000} MB.`);
            return;
        }

        try {
            await Auth.confirmSignUp(session.username, session.confirmationCode);
            await Auth.signIn(session.username, session.password);
            const user = await Auth.currentAuthenticatedUser();
            const key = await s3Upload(session.profilePhoto);

            const token = user.signInUserSession.idToken.jwtToken;
            const request = {
                body: {
                    "id": session.username,
                    "username": session.username,
                    "name": session.name,
                    "surname": session.surname,
                    "school": session.school,
                    "email": session.email,
                    "photo": key
                },
                headers: {
                    Authorization: token
                }
            };
            await API.post('myUsers', "/addnew", request);
            setCompleted(true);

            props.history.push("/");
        } catch (e) {
            alert(e.message);
            setCompleted(false);

        }
    };
    const handleProfilePhotoChange = event => {
        setSession({
            ...session,
            profilePhoto: event.target.files[0]
        })
    };

    function renderConfirmationForm() {
        return (
            <form onSubmit={handleConfirmationSubmit}>
                <FormGroup controlId="confirmationCode" bsSize="large">
                    <ControlLabel>Confirmation Code</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        value={session.confirmationCode}
                        onChange={handleChange}
                    />
                    <HelpBlock>Please check your email for the code.</HelpBlock>
                </FormGroup>
                <Button
                    block
                    disabled={!validateConfirmationForm()}
                    type="submit"
                >Verify</Button>
            </form>
        );
    }


    function registerForm() {
        return (
            <form>
                <FormGroup controlId="file">
                    <ControlLabel>Upload a profile picture</ControlLabel>
                    <FormControl onChange={handleProfilePhotoChange} type="file"/>
                </FormGroup>
                <FormGroup controlId="username" bsSize="large">
                    <ControlLabel>Username</ControlLabel>
                    <FormControl
                        autoFocus
                        type="text"
                        onChange={handleChange}
                        value={session.username}
                    />
                </FormGroup>
                <FormGroup controlId="name" bsSize="large">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl

                        type="text"
                        onChange={handleChange}
                        value={session.name}
                    />
                </FormGroup>
                <FormGroup controlId="surname" bsSize="large">
                    <ControlLabel>Surname</ControlLabel>
                    <FormControl

                        type="text"
                        onChange={handleChange}
                        value={session.surname}
                    />
                </FormGroup>
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        onChange={handleChange}

                        type="email"
                        value={session.email}
                    />
                </FormGroup>

                <FormGroup controlId="school" bsSize="large">
                    <ControlLabel>School</ControlLabel>
                    <FormControl

                        type="text"
                        onChange={handleChange}
                        value={session.school}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        value={session.password}
                        type="password"
                        onChange={handleChange}

                    />
                </FormGroup>
                <FormGroup controlId="confirmPassword" bsSize="large">
                    <ControlLabel>Confirm Password</ControlLabel>
                    <FormControl
                        value={session.confirmPassword}
                        type="password"
                        onChange={handleChange}
                    />
                </FormGroup>
                <Button
                    block
                    disabled={false}
                    type="button"
                    onClick={handleSubmit}
                >Confirm</Button>
            </form>

        )
    }

    return (
        <div className="Signup">
            {
                <>{completed && (confirmation ? renderConfirmationForm() : registerForm())}</>
            }
            {!completed && <Loader
                type="Circles"
                color="#666"
                height={100}
                width={100}

            />}
        </div>
    );
}
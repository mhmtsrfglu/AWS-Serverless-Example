import React, {useEffect, useState} from "react";
import "./Home.css";
import {
  Row
} from "react-bootstrap";
import {Auth, API, Storage} from 'aws-amplify'
import Loader from 'react-loader-spinner'

import profilePhoto from '../../images/logo512.png'


export default function Home(props) {
    const [user, setUser] = useState(false);
    const [userData, setUserData] = useState({file: null});
    const [completed, setCompleted] = useState(false);
    useEffect(() => {
        Auth.currentSession().then(setUser(true))
            .catch(err => props.history.push("/login"));
    }, []);

    useEffect(() => {

        async function getData() {
            const user = await Auth.currentAuthenticatedUser();
            const token = user.signInUserSession.idToken.jwtToken;

            let myInit = {
                headers: {
                    Authorization: token
                }
            };

            const data = await API.get('myUsers', "/getuser/" + user.username, myInit);
            const photo = await Storage.get(data.body.photo.S, {level: "private"});
            setUserData({
                ...user,
                name: data.body.name.S,
                surname: data.body.surname.S,
                username: data.body.username.S,
                school: data.body.school.S,
                email: data.body.email.S,
                profilePhoto: photo
            });

            setCompleted(true);

        }

        if (user) {
            getData();
        }
    }, [user]);


    return (
        <div className="Home">
            {(userData && completed) && <div className="lander">
                <h1>Hello AWS Serverless</h1>
                <hr/>
                <Row>
                    <div className={""}>Profile Picture</div>
                    <div><img className={"img-fluid profilePhoto"}
                              src={userData.profilePhoto ? userData.profilePhoto : profilePhoto} alt=""/></div>

                </Row>

                <table className={"table table-responsive"}>
                    <thead>
                    <tr>
                        <td>Username</td>
                        <td>Name</td>
                        <td>Surname</td>
                        <td>School</td>
                        <td>Email</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>{userData.username}</td>
                        <td>{userData.name}</td>
                        <td>{userData.surname}</td>
                        <td>{userData.school}</td>
                        <td>{userData.email}</td>
                    </tr>
                    </tbody>
                </table>
            </div>}
            {!completed && <Loader
                type="Circles"
                color="#666"
                height={100}
                width={100}

            />}
        </div>
    );
}
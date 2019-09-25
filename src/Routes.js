import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Containers/Home/Home";
import NotFound from "./Containers/NotFound/NotFound";
import Login from "./Containers/Login/Login";
import Signup from "./Containers/Signup/Signup";

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" exact component={Login} />
    <Route path="/signup" exact component={Signup} />
    <Route component={NotFound} />
  </Switch>;
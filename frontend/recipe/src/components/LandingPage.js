// LandingPage.js

import React, { useState } from 'react';
import './LandingPage.css';
import logo from '../splash.png';
import { Link } from 'react-router-dom';
import mainiamge from './images/vegetable-eggs.png';
import pasta from './images/pasta.png';
import nuggets from "./images/chicken-nuggets.png"

const LandingPage = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isLiked2, setIsLiked2] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };
  const handleLikeClick2 = () => {
    setIsLiked2(!isLiked2);
  };
  return (
    <>

    <div className='bodyy'>
    <header>
        <div className="brand">
        <img src={logo} />
            <h4>RECIPEEZE</h4>
        </div>

        <div className="header-section">
            <div className="hero-heading">
                <h1 className="heading-primary">Delicious <br/> Food Recipes are Waiting <br/> For You</h1>
                <Link to="/signup" className="button button-active view-menu" style={{color:"white"}}>View Recipes 
                    <span><img src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxnPjxwYXRoIGQ9Ik01MDYuMTM0LDI0MS44NDNjLTAuMDA2LTAuMDA2LTAuMDExLTAuMDEzLTAuMDE4LTAuMDE5bC0xMDQuNTA0LTEwNGMtNy44MjktNy43OTEtMjAuNDkyLTcuNzYyLTI4LjI4NSwwLjA2OGMtNy43OTIsNy44MjktNy43NjIsMjAuNDkyLDAuMDY3LDI4LjI4NEw0NDMuNTU4LDIzNkgyMGMtMTEuMDQ2LDAtMjAsOC45NTQtMjAsMjBjMCwxMS4wNDYsOC45NTQsMjAsMjAsMjBoNDIzLjU1N2wtNzAuMTYyLDY5LjgyNGMtNy44MjksNy43OTItNy44NTksMjAuNDU1LTAuMDY3LDI4LjI4NGM3Ljc5Myw3LjgzMSwyMC40NTcsNy44NTgsMjguMjg1LDAuMDY4bDEwNC41MDQtMTA0YzAuMDA2LTAuMDA2LDAuMDExLTAuMDEzLDAuMDE4LTAuMDE5QzUxMy45NjgsMjYyLjMzOSw1MTMuOTQzLDI0OS42MzUsNTA2LjEzNCwyNDEuODQzeiIvPjwvZz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+" alt="Arrow right" /></span>
                </Link>

                <div className="food-categories food-categories-1">
                    <button><img src="data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIgNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHdpZHRoPSI1MTIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGc+PGc+PHBhdGggZD0ibTE4Ni44MjYgODUuMzQzYzIuNjY1IDAgNS4yNDctMS40MjUgNi42MDMtMy45MzVsNi41MDQtMTIuMDM1YzEuOTY5LTMuNjQzLjYxMi04LjE5Mi0zLjAzMS0xMC4xNjEtMy42NDYtMS45NjktOC4xOTMtLjYxLTEwLjE2MSAzLjAzMWwtNi41MDQgMTIuMDM1Yy0xLjk2OSAzLjY0My0uNjEyIDguMTkzIDMuMDMxIDEwLjE2MSAxLjEzMy42MTMgMi4zNTMuOTA0IDMuNTU4LjkwNHoiLz48cGF0aCBkPSJtMjYzLjQwOCA3OC42NjZ2LTEzLjY4YzAtNC4xNDEtMy4zNTctNy40OTgtNy40OTgtNy40OThzLTcuNDk4IDMuMzU3LTcuNDk4IDcuNDk4djEzLjY4YzAgNC4xNDEgMy4zNTcgNy40OTggNy40OTggNy40OThzNy40OTgtMy4zNTcgNy40OTgtNy40OTh6Ii8+PHBhdGggZD0ibTMyNS4xNzUgODUuMjQyYzEuMjc3IDAgMi41NzEtLjMyNyAzLjc1NS0xLjAxMyAzLjU4Mi0yLjA3OCA0LjgwMi02LjY2NiAyLjcyNC0xMC4yNDhsLTYuODYzLTExLjgzNGMtMi4wNzgtMy41ODItNi42NjYtNC44MDEtMTAuMjQ4LTIuNzI0LTMuNTgyIDIuMDc4LTQuODAyIDYuNjY2LTIuNzI0IDEwLjI0OGw2Ljg2MyAxMS44MzRjMS4zOTEgMi4zOTcgMy45MDcgMy43MzcgNi40OTMgMy43Mzd6Ii8+PHBhdGggZD0ibTUxMiAyMzEuNjA2di02LjYwNmMwLTE0LjAwNS03LjA1NC0yNi4zODgtMTcuNzkxLTMzLjggMi41MjctMi4wNDEgNC44MDYtNC40NDUgNi43NTYtNy4yMDMgNi42NTEtOS40MDYgOC4zMjItMjEuNTIxIDQuNDcxLTMyLjQwNi05LjMtMjYuMjktMjguNjI4LTY0LjE0OS02Ny44OTMtOTUuMjE1LTQ1LjI3My0zNS44MTgtMTA2LjMxNi01NC41MzItMTgxLjQzNS01NS42MTktLjA3Mi0uMDAxLS4xNDUtLjAwMS0uMjE3IDAtMzMuOTUxLjQ5MS02NS40MDIgNC42NDUtOTMuNDc5IDEyLjM0Ni0zLjk5MyAxLjA5NS02LjM0MyA1LjIyMS01LjI0OCA5LjIxNHM1LjIyIDYuMzQ1IDkuMjE0IDUuMjQ4YzI2LjgyNi03LjM1OCA1Ni45NzgtMTEuMzMyIDg5LjYyMS0xMS44MTIgMTYyLjIxNCAyLjM5IDIxNy4wNTMgODkuMjYgMjM1LjI5OCAxNDAuODM5IDIuMjYzIDYuMzk2IDEuMzIzIDEzLjIyOS0yLjU3OCAxOC43NDgtMy44NjggNS40NzEtOS45MzQgOC42MDktMTYuNjQyIDguNjA5aC00MzIuMTU4Yy02LjczMyAwLTEyLjgzMS0zLjE1Ni0xNi43MjgtOC42Ni0zLjg1MS01LjQzNy00Ljc5Ny0xMi4xNDItMi41OTctMTguMzk0IDEzLjMwMS0zNy43OTYgNDMuODQ2LTg5LjAxMiAxMTMuODI1LTExOC4zNiAzLjgxOS0xLjYwMiA1LjYxNy01Ljk5NSA0LjAxNS05LjgxNC0xLjYwMi0zLjgyLTUuOTk4LTUuNjE1LTkuODE0LTQuMDE1LTM0LjA3NCAxNC4yOS02Mi41ODYgMzQuOTM2LTg0Ljc0MiA2MS4zNjQtMTYuMzAzIDE5LjQ0NS0yOC44OTYgNDEuNTk5LTM3LjQyOSA2NS44NDctMy44MzYgMTAuOTAyLTIuMTk1IDIyLjU4IDQuNTA1IDMyLjAzOSAxLjk1MSAyLjc1NiA0LjI3MSA1LjE3NCA2Ljg1NSA3LjIzMi0xMC43NDggNy40MTEtMTcuODA5IDE5LjgtMTcuODA5IDMzLjgxMnY2LjYwNmMwIDE5Ljc5OSAxNC4wODkgMzYuMzY4IDMyLjc2NyA0MC4yMTFsLS4xNSA0NC43NzZjLTE4LjYwMiAzLjkwMS0zMi42MTcgMjAuNDI4LTMyLjYxNyA0MC4xNzJ2Ni42MDZjMCAxOS43ODggMTQuMDc0IDM2LjM0OSAzMi43MzcgNDAuMjA0LS41MDMgNy44OTEtLjI0NSAyMC42OTcgNC4zMDUgMzQuOTQ1IDEyLjI2MyAzOC40IDQ1LjQ3NCA1Ni42ODggNzEuMTc0IDY1LjI2NyAxNC44MjEgNC45NDcgMzAuNjQ5IDcuNDU2IDQ3LjA0NCA3LjQ1NmgyMDEuNDgxYzE2LjM5NSAwIDMyLjIyMi0yLjUwOSA0Ny4wNDMtNy40NTYgMjUuNzAxLTguNTggNTguOTEyLTI2Ljg2NyA3MS4xNzQtNjUuMjY3IDQuNTUtMTQuMjQ3IDQuODA4LTI3LjA1NCA0LjMwNS0zNC45NDUgMTguNjYzLTMuODU0IDMyLjczNy0yMC40MTYgMzIuNzM3LTQwLjIwNHYtNi42MDZjMC0xOS43OTctMTQuMDkxLTM2LjM1Mi0zMi43NjctNDAuMTk0di00NC43NTRjMTguNjc4LTMuODQyIDMyLjc2Ny0yMC40MTIgMzIuNzY3LTQwLjIxMXptLTQ5Ny4wMDQgMTMxLjc2NXYtNi42MDZjMC0xMS4zOTQgNy4zNjEtMjEuMDgxIDE3LjU3LTI0LjYxMWwtLjAxNSA0LjQxOWMwIDEwLjY0MyA1Ljk2OSAyMC4wNzUgMTUuNTc2IDI0LjYxNiA5LjY2MyA0LjU2NyAyMC44MTEgMy4xNzcgMjkuMDktMy42MjcgMy44NzMtMy4xODMgOC41ODgtNi4xMjggMTYuNzkyLTYuMTI4Ljg2MyAwIDEuNjc2LjAzNSAyLjQ2OS4wODR2MzcuOTA5aC01NS40MjdjLTE0LjM2NyAwLTI2LjA1NS0xMS42ODktMjYuMDU1LTI2LjA1NnptMjk4Ljc5Mi01OC42NTFoMTUwLjQ0OXYzMS44NTZjMCA0Ljg1Ny0yLjYxMyA4Ljk5MS02Ljk4OCAxMS4wNTgtNC40MzIgMi4wOTQtOS4zNTEgMS40NzYtMTMuMTYtMS42NTQtNS40MDYtNC40NDMtMTMuMjgzLTkuNTQzLTI2LjMyMS05LjU0My0xNi4wOTkgMC0yNC4zNTMgNi41MzgtMzEuNjM1IDEyLjMwNy02LjM5NCA1LjA2NS0xMS40NDUgOS4wNjUtMjIuMzI1IDkuMDY1LTEwLjg4MSAwLTE1LjkzMS00LTIyLjMyNS05LjA2NS03LjI4Mi01Ljc2OC0xNS41MzYtMTIuMzA3LTMxLjYzNi0xMi4zMDdzLTI0LjcxNCA2LjgyNC0zMS42MzYgMTIuMzA3Yy02LjM5NCA1LjA2NS0xMS40NDQgOS4wNjUtMjIuMzIzIDkuMDY1LTEwLjg4IDAtMTUuOTMtNC0yMi4zMjMtOS4wNjUtNi45MjEtNS40ODMtMTUuNTM2LTEyLjMwNy0zMS42MzUtMTIuMzA3LTE2LjEgMC0yNC4zNTMgNi41MzgtMzEuNjM2IDEyLjMwNy00LjU1OCAzLjYxMS04LjQ1MSA2LjY2Ny0xNC4yNDUgOC4xMjl2LTQyLjIxOWMwLTUuNDc4IDQuNDU2LTkuOTM0IDkuOTM0LTkuOTM0aDExMi42NDZjNC4xNDEgMCA3LjQ5OC0zLjM1NyA3LjQ5OC03LjQ5OHMtMy4zNTctNy40OTgtNy40OTgtNy40OThoLTExMi42NDdjLTEzLjc0NyAwLTI0LjkzIDExLjE4My0yNC45MyAyNC45M3Y5Mi4zNDFjMCA4LjE1NS02LjYzNCAxNC43OS0xNC43ODkgMTQuNzlzLTE0Ljc4OS02LjYzNS0xNC43ODktMTQuNzl2LTkyLjM0MWMwLTEzLjc0Ny0xMS4xODQtMjQuOTMtMjQuOTMtMjQuOTNoLTM4Ljc4MXYtMTcuMDY2aDQxNi40NzR2MTcuMDY2aC0xNTAuNDQ5Yy00LjE0MSAwLTcuNDk4IDMuMzU3LTcuNDk4IDcuNDk4czMuMzU3IDcuNDk4IDcuNDk4IDcuNDk4em0tMjI3LjI0NSAwYzUuNDc4IDAgOS45MzUgNC40NTYgOS45MzUgOS45MzR2MjEuODQ2Yy0uODAzLS4wMzctMS42Mi0uMDYzLTIuNDY5LS4wNjMtMTMuMDM0IDAtMjAuOTA5IDUuMDk3LTI2LjMxMyA5LjUzOC0zLjgxIDMuMTMtOC43MjkgMy43NDktMTMuMTYzIDEuNjU0LTQuMzc1LTIuMDY3LTYuOTg3LTYuMjAxLTYuOTg3LTExLjA1N3YtMzEuODUyem0zNzQuMTMgMTI5LjIzOGMtOC4zMDggMjYuMDE3LTI5LjA0NiA0NC43MjUtNjEuNjM4IDU1LjYwNC0xMy4yODcgNC40MzYtMjcuNTE3IDYuNjg1LTQyLjI5NSA2LjY4NWgtMjAxLjQ4Yy0xNC43NzggMC0yOS4wMDgtMi4yNDktNDIuMjk1LTYuNjg1LTYzLjg0NS0yMS4zMTItNjYuNTE5LTY4LjM5LTY1LjMwOC04NS4xNGg0OC44MjJ2Mi41NzJjMCAxNi40MjQgMTMuMzYxIDI5Ljc4NiAyOS43ODUgMjkuNzg2czI5Ljc4NS0xMy4zNjEgMjkuNzg1LTI5Ljc4NnYtMi41NzJoMzA4LjI1NmMuNDIzIDYuNDA1LjI3MSAxNy4zMTMtMy42MzIgMjkuNTM2em0zNi4zMzEtNzcuMTkzdjYuNjA2YzAgMTQuMzY3LTExLjY4OSAyNi4wNTYtMjYuMDU2IDI2LjA1NmgtMzE0Ljl2LTE3LjI0OGMxMC45OTUtMS43NTQgMTcuNjA3LTYuOTY4IDIzLjU1Ni0xMS42OCA2LjM5NC01LjA2NSAxMS40NDUtOS4wNjUgMjIuMzI1LTkuMDY1czE1LjkzIDQgMjIuMzIzIDkuMDY1YzYuOTIyIDUuNDgzIDE1LjUzNiAxMi4zMDcgMzEuNjM1IDEyLjMwN3MyNC4zNTMtNi41MzggMzEuNjM1LTEyLjMwN2M2LjM5NC01LjA2NSAxMS40NDQtOS4wNjUgMjIuMzI0LTkuMDY1IDEwLjg4MSAwIDE1LjkzMSA0IDIyLjMyNSA5LjA2NSA3LjI4MiA1Ljc2OCAxNS41MzYgMTIuMzA3IDMxLjYzNiAxMi4zMDdzMjQuMzU0LTYuNTM4IDMxLjYzNi0xMi4zMDdjNi4zOTQtNS4wNjUgMTEuNDQ0LTkuMDY1IDIyLjMyNC05LjA2NSA4LjIwNyAwIDEyLjkyNCAyLjk0NyAxNi43OTkgNi4xMzMgOC4yNzggNi44MDMgMTkuNDI1IDguMTk0IDI5LjA4OSAzLjYyNyA5LjYwOC00LjU0IDE1LjU3Ny0xMy45NzMgMTUuNTc3LTI0LjYxN3YtNC41MDhjMTAuMzE4IDMuNDY5IDE3Ljc3MiAxMy4yMjUgMTcuNzcyIDI0LjY5NnptLTI2LjA1NS05OS4xMDNoLTQyOS44OThjLTE0LjM2NyAwLTI2LjA1Ni0xMS42ODktMjYuMDU2LTI2LjA1NnYtNi42MDZjMC0xNC4zNjcgMTEuNjg5LTI2LjA1NiAyNi4wNTYtMjYuMDU2aDQyOS44OTdjMTQuMzY3IDAgMjYuMDU2IDExLjY4OSAyNi4wNTYgMjYuMDU2djYuNjA2YzAgMTQuMzY3LTExLjY4OCAyNi4wNTYtMjYuMDU1IDI2LjA1NnoiLz48L2c+PC9nPjwvc3ZnPg==" className="food-icons" title="Burger" alt="Burger" /></button>
                    <button><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+PGcgaWQ9Ik91dGxpbmUiPjxwYXRoIGQ9Ik00NDcuNzI5LDkzLjQ3NWMuMTc2LTEuOC4yNzEtMy42MjguMjcxLTUuNDc1YTU1Ljk2NCw1NS45NjQsMCwwLDAtOTUuOTQ5LTM5LjE5MkMzNDYuNzI3LDQ4LjI3OSwzNDEuMzQ3LDQ4LDMzNiw0OGgtOGE3Ljk5NCw3Ljk5NCwwLDAsMC0zLjU3OC44NDVsLTMwNCwxNTJBOCw4LDAsMCwwLDE2LjAwNSwyMDhoMHY4OGE4LDgsMCwwLDAsOCw4SDc2YTEyLjAxMywxMi4wMTMsMCwwLDEsMTIsMTJ2MTZhMjgsMjgsMCwwLDAsNTYsMFYzMTZhMTIuMDEzLDEyLjAxMywwLDAsMSwxMi0xMkg0ODB2NzJINDUyYTI4LjAzMiwyOC4wMzIsMCwwLDAtMjgsMjh2OGExMiwxMiwwLDAsMS0yNCwwdi04YTI4LDI4LDAsMCwwLTU2LDB2NDhhMTIsMTIsMCwwLDEtMjQsMFY0MDRhMjguMDMyLDI4LjAzMiwwLDAsMC0yOC0yOEgzMlYzMjhIMTZWNDQ4YTMyLjAzNiwzMi4wMzYsMCwwLDAsMzIsMzJIMjg4VjQ2NEg0OGExNi4wMTksMTYuMDE5LDAsMCwxLTE2LTE2VjM5MkgyOTJhMTIuMDEzLDEyLjAxMywwLDAsMSwxMiwxMnY0OGEyOCwyOCwwLDAsMCw1NiwwVjQwNGExMiwxMiwwLDAsMSwyNCwwdjhhMjgsMjgsMCwwLDAsNTYsMHYtOGExMi4wMTMsMTIuMDEzLDAsMCwxLDEyLTEyaDI4djU2YTE2LjAxOSwxNi4wMTksMCwwLDEtMTYsMTZIMzc2djE2aDg4YTMyLjAzNiwzMi4wMzYsMCwwLDAsMzItMzJWMjA4QTE2MC41MTgsMTYwLjUxOCwwLDAsMCw0NDcuNzI5LDkzLjQ3NVpNMzkyLDQ4YTQwLDQwLDAsMSwxLTQwLDQwQTQwLjA0NSw0MC4wNDUsMCwwLDEsMzkyLDQ4Wk0zMjkuODg5LDY0SDMzNmMxLjc4NiwwLDMuNTc1LjA0Myw1LjM2NS4xMDlhNTUuOTg2LDU1Ljk4NiwwLDEsMCwxMDEuNDYzLDQ3LjM1NkExNDQuNTg1LDE0NC41ODUsMCwwLDEsNDc5Ljc3NSwyMDBINTcuODg5Wk0xNTYsMjg4YTI4LjAzMiwyOC4wMzIsMCwwLDAtMjgsMjh2MTZhMTIsMTIsMCwwLDEtMjQsMFYzMTZhMjguMDMyLDI4LjAzMiwwLDAsMC0yOC0yOEgzMlYyMTZINDgwdjcyWk0zMzguMzQzLDEzMC4zNDNsMTEuMzE0LDExLjMxNC0yNCwyNC0xMS4zMTQtMTEuMzE0Wm0tNDgsMy4zMTQtMjQtMjQsMTEuMzE0LTExLjMxNCwyNCwyNFptLTg0LjY4NiwxMi42ODYsMjQsMjQtMTEuMzE0LDExLjMxNC0yNC0yNFptNTIuNjg2LTI0LDExLjMxNCwxMS4zMTQtMjQsMjQtMTEuMzE0LTExLjMxNFptMjAzLjMxNCw1MS4zMTQtMjQsMjQtMTEuMzE0LTExLjMxNCwyNC0yNFpNMzUyLDE2OGgzMnYxNkgzNTJabS0yMDgsMGgzMnYxNkgxNDRabTEyOCwwaDMydjE2SDI3MloiLz48L2c+PC9zdmc+" className="food-icons" title="Cake" alt="Cake" /></button>
                    <button><img src="data:image/svg+xml;base64,PHN2ZyBpZD0iQ2FwYV8xIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA1MTIuMjY4IDUxMi4yNjgiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgNTEyLjI2OCA1MTIuMjY4IiB3aWR0aD0iNTEyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnPjxnPjxwYXRoIGQ9Im00MTguMDg4IDY5LjUzMWMtMi41MzYtOS4zMzctNS42NzEtMTcuMjI5LTkuMzE3LTIzLjQ1Ny00LjUyMS03LjcyMy0xMi45MDEtMTIuNTIxLTIxLjg3MS0xMi41MjFoLTYuNWwtMy41MzItMTIuMTAxYy0zLjY4Ni0xMi42My0xNS40NTEtMjEuNDUyLTI4LjYxLTIxLjQ1MmgtMjEuNTk5Yy00LjE0MiAwLTcuNSAzLjM1Ny03LjUgNy41czMuMzU4IDcuNSA3LjUgNy41aDIxLjU5OWM2LjUzNiAwIDEyLjM4IDQuMzgyIDE0LjIxMSAxMC42NTZsMi4zMDUgNy44OTdoLTIxNy4yODFsMi4zMDUtNy44OTdjMS44MzMtNi4yOCA3LjY3LTEwLjY1NiAxMS43NjItMTAuNjU2aDEyOS45ODJjNC4xNDIgMCA3LjUtMy4zNTcgNy41LTcuNXMtMy4zNTgtNy41LTcuNS03LjVoLTEyOS45ODJjLTExLjM0NCAwLTIyLjU5MSA5LjIyMy0yNi4xNjEgMjEuNDUzbC0zLjUzMiAxMi4xMDFoLTYuNDk5Yy04Ljk3IDAtMTcuMzUgNC43OTgtMjEuODcxIDEyLjUyMS0zLjY0NiA2LjIyOS02Ljc4MSAxNC4xMi05LjMxNyAyMy40NTctMS41NjMgNS43NTctLjM4MSAxMS43NzggMy4yNDYgMTYuNTIxIDMuNjM0IDQuNzUyIDkuMTQ5IDcuNDc4IDE1LjEzMSA3LjQ3OGg3LjM5OGw2LjI0MiA5Mi4zNGMtLjczMi41NDQtMS40MjcgMS4xNDQtMi4wNTcgMS44MTktMi44ODMgMy4wOTItNC4zNjkgNy4yODQtNC4wNzQgMTEuNTAybDUuMjA2IDc0LjU2M2MuMjg5IDQuMTMxIDMuODY5IDcuMjU5IDguMDA0IDYuOTU5IDQuMTMyLS4yODggNy4yNDgtMy44NzIgNi45NTktOC4wMDRsLTUuMjA2LTc0LjU2M2MtLjAwMy0uMDQyLS4wMDktLjEzMS4wOC0uMjI3cy4xNzQtLjA5Ni4yMi0uMDk2aDI0MS42MDljLjA0NSAwIC4xMyAwIC4yMi4wOTZzLjA4My4xODUuMDguMjI3bC0xMy41ODIgMTk0LjU0NmMtLjAxMS4xNTctLjE0My4yOC0uMy4yOGgtMjE0LjQ0NWMtLjE1NyAwLS4yODktLjEyMy0uMy0uMjhsLTUuOTMyLTg0Ljk2OGMtLjI4OS00LjEzMi0zLjg2OS03LjI1Ny04LjAwNC02Ljk1OS00LjEzMi4yODgtNy4yNDggMy44NzItNi45NTkgOC4wMDRsNS45MzIgODQuOTY3Yy4zNTggNS4xMzIgMy4yNjQgOS41MzcgNy40MTQgMTIuMDM4bDYuMjg4IDkzLjAyMWMuNTExIDcuNTU1IDYuNzU0IDEzLjQ3MyAxNC4yMTMgMTMuNDczaDE4OS4xNDNjNy40NTkgMCAxMy43MDMtNS45MTggMTQuMjEzLTEzLjQ3M2w2LjI4OC05My4wMjFjNC4xNS0yLjUgNy4wNTUtNi45MDYgNy40MTQtMTIuMDM3bDEzLjU4Mi0xOTQuNTQ2Yy4yOTQtNC4yMTgtMS4xOTEtOC40MS00LjA3NC0xMS41MDItLjYyOS0uNjc1LTEuMzI1LTEuMjc1LTIuMDU3LTEuODE5bDYuMjQyLTkyLjM0aDcuMzk4YzUuOTgyIDAgMTEuNDk4LTIuNzI2IDE1LjEzMS03LjQ3OCAzLjYyNi00Ljc0MyA0LjgwOC0xMC43NjUgMy4yNDUtMTYuNTIyem0tNjguMTAxIDQyNy43MzdoLTE4Ny43MDdsLTYuMDM2LTg5LjI5NWgxOTkuNzc5em0yMS4yNTUtMzE0LjQ0NGgtMjMwLjIxN2wtNi4wMzYtODkuMjk0aDI0Mi4yOXptMzEuNjg1LTEwNS44ODNjLS40NTQuNTkzLTEuNDc1IDEuNTg5LTMuMjE2IDEuNTg5aC0yODcuMTU0Yy0xLjc0MSAwLTIuNzYyLS45OTYtMy4yMTYtMS41ODktLjQ0OS0uNTg4LTEuMTM2LTEuODIxLS42ODYtMy40NzkgMi4xNTgtNy45NDUgNC44NTEtMTQuNzk2IDcuNzg3LTE5LjgxMSAxLjg0MS0zLjE0NSA1LjI2MS01LjA5OSA4LjkyNi01LjA5OWgyNjEuNTMxYzMuNjY1IDAgNy4wODUgMS45NTQgOC45MjcgNS4wOTkgMi45MzYgNS4wMTUgNS42MjggMTEuODY1IDcuNzg2IDE5LjgxMS40NTEgMS42NTgtLjIzNiAyLjg5Mi0uNjg1IDMuNDc5eiIvPjxwYXRoIGQ9Im0zMTIuNzY1IDI5NS4zOThjMC0zMS4yMjctMjUuNDA1LTU2LjYzMS01Ni42MzEtNTYuNjMxcy01Ni42MzEgMjUuNDA0LTU2LjYzMSA1Ni42MzEgMjUuNDA1IDU2LjYzMiA1Ni42MzEgNTYuNjMyIDU2LjYzMS0yNS40MDUgNTYuNjMxLTU2LjYzMnptLTk4LjI2MyAwYzAtMjIuOTU1IDE4LjY3Ni00MS42MzEgNDEuNjMxLTQxLjYzMXM0MS42MzEgMTguNjc2IDQxLjYzMSA0MS42MzFjMCAyMi45NTYtMTguNjc2IDQxLjYzMi00MS42MzEgNDEuNjMycy00MS42MzEtMTguNjc2LTQxLjYzMS00MS42MzJ6Ii8+PC9nPjwvZz48L3N2Zz4=" className="food-icons" title="Coffee" alt="Coffee" /></button>
                    <button><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+PGcgaWQ9Ik91dGxpbmUiPjxwYXRoIGQ9Ik0xMjgsMTkydjE2YTgsOCwwLDAsMCwxNiwwVjE5MmgxNnYxNmEyNCwyNCwwLDAsMS00OCwwVjE5MlpNNDk2LDUzLjNhMzcuMzYyLDM3LjM2MiwwLDAsMS04Ljc3OCwyNC4wNDJMNDExLjQsMTY3LjM3OGExMjguMDE4LDEyOC4wMTgsMCwwLDEsMjUuNTUzLDEwOC4zOTNBMjQuMDEsMjQuMDEsMCwwLDEsNDI0LDMyMGgtMS4wMTdMMzk5LjkyNyw0ODkuMDgxQTgsOCwwLDAsMSwzOTIsNDk2SDEyMGE4LDgsMCwwLDEtNy45MjctNi45MTlMODkuMDE3LDMyMEg4OGEyNCwyNCwwLDEsMSwwLTQ4aDk4LjI2OEExMjguNTg5LDEyOC41ODksMCwwLDEsMTg0LDI0OGExMjYuODg0LDEyNi44ODQsMCwwLDEsMTIuNDczLTU1LjE4MiwxMjkuMTc0LDEyOS4xNzQsMCwwLDEsNjQuOTkyLTYyLjQzNkExMTIuMDE1LDExMi4wMTUsMCwwLDAsMjAwLDExMmExMTAuODIxLDExMC44MjEsMCwwLDAtNDkuMjI3LDExLjM3MmMtLjA3Ni4wMzgtLjE1My4wNzQtLjIzMS4xMDlhMTEyLjE5MywxMTIuMTkzLDAsMCwwLTU4LjUxNywxMzAuMzlMNzYuNiwyNTguMTI5YTEyOC4wNTIsMTI4LjA1MiwwLDAsMSw2My44LTE0Ny40MjRBMTI3Ljk4OCwxMjcuOTg4LDAsMCwxLDM4My43NjcsOTguODdsNDAuODM5LTY1LjM0QTM3LjExOCwzNy4xMTgsMCwwLDEsNDU2LjI0LDE2aDIuNDZBMzcuMzQxLDM3LjM0MSwwLDAsMSw0OTYsNTMuM1pNMjAwLDk2YTEyNy45NzIsMTI3Ljk3MiwwLDAsMSw3OS45NTcsMjguMDU1LDEyOC40MDcsMTI4LjQwNywwLDAsMSw4My43OSw2Ljg0Nmw4Ljg3Ni0xNC4yQTExMS45OTQsMTExLjk5NCwwLDAsMCwyNjQsMzJhMTEwLjc3MiwxMTAuNzcyLDAsMCwwLTY5LjkzNywyNC41MTgsMTEyLjgxMSwxMTIuODExLDAsMCwwLTM0LjAyNCw0NS44MzlBMTI3LjE3LDEyNy4xNywwLDAsMSwyMDAsOTZaTTg4LDMwNEgyODBWMjg4SDg4YTgsOCwwLDAsMCwwLDE2Wm0zMTguODM1LDE2SDM5MmEyNCwyNCwwLDAsMS00OCwwVjI5NmE4LDgsMCwwLDAtMTYsMHY4YTIzLjk4NiwyMy45ODYsMCwwLDEtNDEuODY5LDE2SDEwNS4xNjVsMjEuODE4LDE2MEgzODUuMDE3Wk00MzIsMjk2YTcuOTg1LDcuOTg1LDAsMCwwLTgtOEgzOTJ2MTZoMzJhNy45ODEsNy45ODEsMCwwLDAsOC04Wm0tOC00OGExMTIuMiwxMTIuMiwwLDAsMC02MC44ODItOTkuNjgybC0uMDE5LS4wMSwwLDBBMTEwLjc0NCwxMTAuNzQ0LDAsMCwwLDMxMiwxMzZhMTEyLjAwNywxMTIuMDA3LDAsMCwwLTMxLjY2OSw0LjU0NGMtMS45NjguNTY4LTMuODg3LDEuMTktNS45MDksMS45MTZhMTEyLjkzLDExMi45MywwLDAsMC02My41MTUsNTcuMjYyQTExMSwxMTEsMCwwLDAsMjAwLDI0OGExMTIuMzU1LDExMi4zNTUsMCwwLDAsMi41OTUsMjRIMjg4YTgsOCwwLDAsMSw4LDh2MjRhOC4wMDksOC4wMDksMCwwLDAsOC41NDgsNy45ODJBOC4xOSw4LjE5LDAsMCwwLDMxMiwzMDMuNzE3VjI5NmEyNC4wMjgsMjQuMDI4LDAsMCwxLDIzLjU4OC0yNEMzNDkuMDEzLDI3MS43NzYsMzYwLDI4My4xMTksMzYwLDI5Ni41NDZWMzIwYTguMDA5LDguMDA5LDAsMCwwLDguNTQ4LDcuOTgyQTguMTksOC4xOSwwLDAsMCwzNzYsMzE5LjcxN1YyODBhOCw4LDAsMCwxLDgtOGgzNy40MDhBMTEyLjQxOSwxMTIuNDE5LDAsMCwwLDQyNCwyNDhaTTQ4MCw1My4zQTIxLjMyNCwyMS4zMjQsMCwwLDAsNDU4LjcsMzJoLTIuNDZhMjEuMjA4LDIxLjIwOCwwLDAsMC0xOC4wNywxMC4wMTZsLTYwLjE5NSw5Ni4zMDhhMTI1Ljk3NCwxMjUuOTc0LDAsMCwxLDIyLjUsMTcuMTg5bDc0LjUxMy04OC40ODZBMjEuMzY1LDIxLjM2NSwwLDAsMCw0ODAsNTMuM1pNMTQwLjU4NiwzNDIuOTE5bC0xNS44NTMsMi4xNjIsMi4zMywxNy4wOTIsMTUuODU0LTIuMTYyWm0tMTEuMSwzNy4wMTUsMTAuNTIsNzcuMTQ3LDE1Ljg1My0yLjE2Mi0xMC41Mi03Ny4xNDdaTTM2OCwyMDBhOCw4LDAsMCwxLTE2LDBWMTg0SDMzNnYxNmEyNCwyNCwwLDAsMCw0OCwwVjE4NEgzNjhaTTI0OCw2NGgxNlY0OEgyNDhabTY0LDE2SDI5NlY5NmgxNlpNMTkyLDE0NEgxNzZ2MTZoMTZabTU2LDcyaDE2VjIwMEgyNDhabTQwLTMyaDE2VjE2OEgyODhabTI0LDIwMGE4LDgsMCwwLDEtMTYsMFYzNjhIMjgwdjE2YTI0LDI0LDAsMCwwLDQ4LDBWMzY4SDMxMloiLz48L2c+PC9zdmc+" className="food-icons" title="Ice-Cream" alt="Ice-cream" /></button>
                </div>
            </div>

            <div className="header-image">
                <img src={mainiamge} alt="Vegetable eggs" />
            </div>
        </div>
    </header>

    <main>
        <section className="section-1">
            <div className="menu-items-column">
                <div className="menu-item-card menu-item-card-1">
                    <img src={pasta} className="menu-item-image-1" alt="Cheeseburger" />

                    <div className="menu-item-type-1">
                        <div className="menu-item-details menu-item-details-1">
                            <h3>Pasta</h3>
                            <p>Pasta with tomatoes</p>
                        </div>

                        <button
      className={`like-button like-button-1 ${isLiked ? 'favourite' : ''}`}
      onClick={handleLikeClick}
      style={{ backgroundColor: isLiked ? 'red' : 'rgba(0, 0, 0, 0.1)' }}
    >
                                <img src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxnPjxwYXRoIGQ9Ik00NzQuNjQ0LDc0LjI3QzQ0OS4zOTEsNDUuNjE2LDQxNC4zNTgsMjkuODM2LDM3NiwyOS44MzZjLTUzLjk0OCwwLTg4LjEwMywzMi4yMi0xMDcuMjU1LDU5LjI1Yy00Ljk2OSw3LjAxNC05LjE5NiwxNC4wNDctMTIuNzQ1LDIwLjY2NWMtMy41NDktNi42MTgtNy43NzUtMTMuNjUxLTEyLjc0NS0yMC42NjVjLTE5LjE1Mi0yNy4wMy01My4zMDctNTkuMjUtMTA3LjI1NS01OS4yNWMtMzguMzU4LDAtNzMuMzkxLDE1Ljc4MS05OC42NDUsNDQuNDM1QzEzLjI2NywxMDEuNjA1LDAsMTM4LjIxMywwLDE3Ny4zNTFjMCw0Mi42MDMsMTYuNjMzLDgyLjIyOCw1Mi4zNDUsMTI0LjdjMzEuOTE3LDM3Ljk2LDc3LjgzNCw3Ny4wODgsMTMxLjAwNSwxMjIuMzk3YzE5LjgxMywxNi44ODQsNDAuMzAyLDM0LjM0NCw2Mi4xMTUsNTMuNDI5bDAuNjU1LDAuNTc0YzIuODI4LDIuNDc2LDYuMzU0LDMuNzEzLDkuODgsMy43MTNzNy4wNTItMS4yMzgsOS44OC0zLjcxM2wwLjY1NS0wLjU3NGMyMS44MTMtMTkuMDg1LDQyLjMwMi0zNi41NDQsNjIuMTE4LTUzLjQzMWM1My4xNjgtNDUuMzA2LDk5LjA4NS04NC40MzQsMTMxLjAwMi0xMjIuMzk1QzQ5NS4zNjcsMjU5LjU3OCw1MTIsMjE5Ljk1NCw1MTIsMTc3LjM1MUM1MTIsMTM4LjIxMyw0OTguNzMzLDEwMS42MDUsNDc0LjY0NCw3NC4yN3ogTTMwOS4xOTMsNDAxLjYxNGMtMTcuMDgsMTQuNTU0LTM0LjY1OCwyOS41MzMtNTMuMTkzLDQ1LjY0NmMtMTguNTM0LTE2LjExMS0zNi4xMTMtMzEuMDkxLTUzLjE5Ni00NS42NDhDOTguNzQ1LDMxMi45MzksMzAsMjU0LjM1OCwzMCwxNzcuMzUxYzAtMzEuODMsMTAuNjA1LTYxLjM5NCwyOS44NjItODMuMjQ1Qzc5LjM0LDcyLjAwNywxMDYuMzc5LDU5LjgzNiwxMzYsNTkuODM2YzQxLjEyOSwwLDY3LjcxNiwyNS4zMzgsODIuNzc2LDQ2LjU5NGMxMy41MDksMTkuMDY0LDIwLjU1OCwzOC4yODIsMjIuOTYyLDQ1LjY1OWMyLjAxMSw2LjE3NSw3Ljc2OCwxMC4zNTQsMTQuMjYyLDEwLjM1NGM2LjQ5NCwwLDEyLjI1MS00LjE3OSwxNC4yNjItMTAuMzU0YzIuNDA0LTcuMzc3LDkuNDUzLTI2LjU5NSwyMi45NjItNDUuNjZjMTUuMDYtMjEuMjU1LDQxLjY0Ny00Ni41OTMsODIuNzc2LTQ2LjU5M2MyOS42MjEsMCw1Ni42NiwxMi4xNzEsNzYuMTM3LDM0LjI3QzQ3MS4zOTUsMTE1Ljk1Nyw0ODIsMTQ1LjUyMSw0ODIsMTc3LjM1MUM0ODIsMjU0LjM1OCw0MTMuMjU1LDMxMi45MzksMzA5LjE5Myw0MDEuNjE0eiIvPjwvZz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+" alt="Like" />
                        </button>
                    </div>

                    <button className="cart-button">
                    <img src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxnPjxwYXRoIGQ9Ik01MDYuMTM0LDI0MS44NDNjLTAuMDA2LTAuMDA2LTAuMDExLTAuMDEzLTAuMDE4LTAuMDE5bC0xMDQuNTA0LTEwNGMtNy44MjktNy43OTEtMjAuNDkyLTcuNzYyLTI4LjI4NSwwLjA2OGMtNy43OTIsNy44MjktNy43NjIsMjAuNDkyLDAuMDY3LDI4LjI4NEw0NDMuNTU4LDIzNkgyMGMtMTEuMDQ2LDAtMjAsOC45NTQtMjAsMjBjMCwxMS4wNDYsOC45NTQsMjAsMjAsMjBoNDIzLjU1N2wtNzAuMTYyLDY5LjgyNGMtNy44MjksNy43OTItNy44NTksMjAuNDU1LTAuMDY3LDI4LjI4NGM3Ljc5Myw3LjgzMSwyMC40NTcsNy44NTgsMjguMjg1LDAuMDY4bDEwNC41MDQtMTA0YzAuMDA2LTAuMDA2LDAuMDExLTAuMDEzLDAuMDE4LTAuMDE5QzUxMy45NjgsMjYyLjMzOSw1MTMuOTQzLDI0OS42MzUsNTA2LjEzNCwyNDEuODQzeiIvPjwvZz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+" alt="Arrow right" />
                    </button>
                </div>

                <div className="menu-item-card menu-item-card-1">
                    <img src={nuggets} className="menu-item-image-1" alt="Chicken nuggets" />

                    <div className="menu-item-type-1">
                        <div className="menu-item-details menu-item-details-1">
                            <h3>Chicken Nugget</h3>
                            <p>Real chicken</p>
                        </div>
                        <button
      className={`like-button like-button-1 ${isLiked2 ? 'favourite' : ''}`}
      onClick={handleLikeClick2}
      style={{ backgroundColor: isLiked2 ? 'red' : 'rgba(0, 0, 0, 0.1)' }}
    >
                            <img src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxnPjxwYXRoIGQ9Ik00NzQuNjQ0LDc0LjI3QzQ0OS4zOTEsNDUuNjE2LDQxNC4zNTgsMjkuODM2LDM3NiwyOS44MzZjLTUzLjk0OCwwLTg4LjEwMywzMi4yMi0xMDcuMjU1LDU5LjI1Yy00Ljk2OSw3LjAxNC05LjE5NiwxNC4wNDctMTIuNzQ1LDIwLjY2NWMtMy41NDktNi42MTgtNy43NzUtMTMuNjUxLTEyLjc0NS0yMC42NjVjLTE5LjE1Mi0yNy4wMy01My4zMDctNTkuMjUtMTA3LjI1NS01OS4yNWMtMzguMzU4LDAtNzMuMzkxLDE1Ljc4MS05OC42NDUsNDQuNDM1QzEzLjI2NywxMDEuNjA1LDAsMTM4LjIxMywwLDE3Ny4zNTFjMCw0Mi42MDMsMTYuNjMzLDgyLjIyOCw1Mi4zNDUsMTI0LjdjMzEuOTE3LDM3Ljk2LDc3LjgzNCw3Ny4wODgsMTMxLjAwNSwxMjIuMzk3YzE5LjgxMywxNi44ODQsNDAuMzAyLDM0LjM0NCw2Mi4xMTUsNTMuNDI5bDAuNjU1LDAuNTc0YzIuODI4LDIuNDc2LDYuMzU0LDMuNzEzLDkuODgsMy43MTNzNy4wNTItMS4yMzgsOS44OC0zLjcxM2wwLjY1NS0wLjU3NGMyMS44MTMtMTkuMDg1LDQyLjMwMi0zNi41NDQsNjIuMTE4LTUzLjQzMWM1My4xNjgtNDUuMzA2LDk5LjA4NS04NC40MzQsMTMxLjAwMi0xMjIuMzk1QzQ5NS4zNjcsMjU5LjU3OCw1MTIsMjE5Ljk1NCw1MTIsMTc3LjM1MUM1MTIsMTM4LjIxMyw0OTguNzMzLDEwMS42MDUsNDc0LjY0NCw3NC4yN3ogTTMwOS4xOTMsNDAxLjYxNGMtMTcuMDgsMTQuNTU0LTM0LjY1OCwyOS41MzMtNTMuMTkzLDQ1LjY0NmMtMTguNTM0LTE2LjExMS0zNi4xMTMtMzEuMDkxLTUzLjE5Ni00NS42NDhDOTguNzQ1LDMxMi45MzksMzAsMjU0LjM1OCwzMCwxNzcuMzUxYzAtMzEuODMsMTAuNjA1LTYxLjM5NCwyOS44NjItODMuMjQ1Qzc5LjM0LDcyLjAwNywxMDYuMzc5LDU5LjgzNiwxMzYsNTkuODM2YzQxLjEyOSwwLDY3LjcxNiwyNS4zMzgsODIuNzc2LDQ2LjU5NGMxMy41MDksMTkuMDY0LDIwLjU1OCwzOC4yODIsMjIuOTYyLDQ1LjY1OWMyLjAxMSw2LjE3NSw3Ljc2OCwxMC4zNTQsMTQuMjYyLDEwLjM1NGM2LjQ5NCwwLDEyLjI1MS00LjE3OSwxNC4yNjItMTAuMzU0YzIuNDA0LTcuMzc3LDkuNDUzLTI2LjU5NSwyMi45NjItNDUuNjZjMTUuMDYtMjEuMjU1LDQxLjY0Ny00Ni41OTMsODIuNzc2LTQ2LjU5M2MyOS42MjEsMCw1Ni42NiwxMi4xNzEsNzYuMTM3LDM0LjI3QzQ3MS4zOTUsMTE1Ljk1Nyw0ODIsMTQ1LjUyMSw0ODIsMTc3LjM1MUM0ODIsMjU0LjM1OCw0MTMuMjU1LDMxMi45MzksMzA5LjE5Myw0MDEuNjE0eiIvPjwvZz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+" alt="Like" />
                        </button>
                    </div>

                    <button className="cart-button">
                    <img src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxnPjxwYXRoIGQ9Ik01MDYuMTM0LDI0MS44NDNjLTAuMDA2LTAuMDA2LTAuMDExLTAuMDEzLTAuMDE4LTAuMDE5bC0xMDQuNTA0LTEwNGMtNy44MjktNy43OTEtMjAuNDkyLTcuNzYyLTI4LjI4NSwwLjA2OGMtNy43OTIsNy44MjktNy43NjIsMjAuNDkyLDAuMDY3LDI4LjI4NEw0NDMuNTU4LDIzNkgyMGMtMTEuMDQ2LDAtMjAsOC45NTQtMjAsMjBjMCwxMS4wNDYsOC45NTQsMjAsMjAsMjBoNDIzLjU1N2wtNzAuMTYyLDY5LjgyNGMtNy44MjksNy43OTItNy44NTksMjAuNDU1LTAuMDY3LDI4LjI4NGM3Ljc5Myw3LjgzMSwyMC40NTcsNy44NTgsMjguMjg1LDAuMDY4bDEwNC41MDQtMTA0YzAuMDA2LTAuMDA2LDAuMDExLTAuMDEzLDAuMDE4LTAuMDE5QzUxMy45NjgsMjYyLjMzOSw1MTMuOTQzLDI0OS42MzUsNTA2LjEzNCwyNDEuODQzeiIvPjwvZz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PC9zdmc+" alt="Arrow right" />
                    </button>
                </div>
            </div>

            <div className="description">
                <h2 className="heading-secondary">We have delicious food <br/>
                    Tastiest food in town!
                </h2>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit, laudantium laborum nisi ipsum
                    ducimus non quas nostrum repudiandae ea, facere voluptatum nihil soluta quo sint nemo est. Ab, quod
                    repudiandae!
                </p>
            </div>
        </section>

        <section className="section-2">
            <div className="description">
                <h2 className="heading-secondary">
                    Special offers and discounts available on select items!
                </h2>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni eveniet vero, minus dolores
                    facere voluptatem repudiandae quas laudantium ipsum ad sed doloremque facilis non libero
                    optio. Obcaecati odit commodi expedita?
                </p>
            </div>

            <div className="pasta-image">
                <img src={pasta} alt="Pasta" />
                <div className="discount-tag">
                    <h3>VIEW</h3>
                </div>
            </div>
        </section>


    </main>

 
    <footer>
        <div className="contact-us">
            <h2 className="heading-secondary"></h2>
            <Link to="/login" className="button button-active" >Want to discover recipes?</Link>
        </div>

        <div className="description">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Consequatur a ipsam blanditiis, similique,
                aliquam excepturi hic vero accusantium non cumque adipisci. Perspiciatis corrupti iste saepe, molestias
                magni obcaecati. Similique, officiis.</p>
        </div>

        <div className="footer-links">
            <div className="links-group copyright">
                <h3>Copyright</h3>
                <p>Images from <a href="https://www.freepik.com/photos/food" target="_blank" rel="noopener">Freepik</a></p>
                <p>Icons from <a href="https://www.flaticon.com/" target="_blank" rel="noopener">Flaticon</a></p>
                </div>

            <div className="links-group links-group-2">
                <h3>Our Services</h3>
                <a href="https://zakariyaq313.github.io/error-404/" target="_blank" rel="noopener">Pricing</a>
                <a href="https://zakariyaq313.github.io/error-404/" target="_blank" rel="noopener">Tracking</a>
                <a href="https://zakariyaq313.github.io/error-404/" target="_blank" rel="noopener">Report a bug</a>
                <Link to="/termsofservices">Terms of Services</Link>
            </div>

            <div className="links-group">
                <h3>Our Company</h3>
                <a href="https://zakariyaq313.github.io/error-404/" target="_blank" rel="noopener">Reporting</a>
                <a href="https://zakariyaq313.github.io/error-404/" target="_blank" rel="noopener">Get in touch</a>
                <a href="https://zakariyaq313.github.io/error-404/" target="_blank" rel="noopener">Management</a>
            </div>

            <div className="links-group links-group-4">
                <h3>Address</h3>
                <p>Kanhipuram,</p>
                <p>TamilNadu</p>
                <p>codersarogmail.com</p>
            </div>
        </div>
    </footer>
    </div>

    </>
  );
};

export default LandingPage;

// LandingPage.js

import React, { useState } from 'react';
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

   <div id='box'>
   <div className='bodyy'>
    <header>
        <Link to="/" >
        <div className="brand">
        <img src={logo} />
            <h4>RECIPEEZE</h4>
        </div>
        </Link>

        <div className="header-section">
            <div className="hero-heading">
                <h1 className="heading-primary">Delicious <br/> Food Recipes are Waiting <br/> For You</h1>
                <Link to="/signup" className="button button-active view-menu" style={{color:"white"}}>
                <span>View Recipes &#x2192;</span> 
                </Link>


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
      className={`likes-button likes-button-1 ${isLiked ? 'favourite' : ''}`}
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
      className={`likes-button likes-button-1 ${isLiked2 ? 'favourite' : ''}`}
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
                <h2 className="heading-secondary">We have delicious food recipes<br/>
                    Waiting For You!
                </h2>
            </div>
        </section>

        <section className="section-2">
            <div className="description">
                <h2 className="heading-secondary">
                    Special Dishes For All Category
                </h2>
                <p>
                Discover special offers and exclusive discounts on selected recipes! Dive into a world of culinary delights where you can explore and enjoy a variety of mouth-watering dishes—all for free.
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
  <p>Welcome to Recipeeze, your go-to destination for mouth-watering recipes, cooking tips, and culinary inspiration. Whether you're a seasoned chef or just starting out in the kitchen, our platform offers a diverse range of recipes that cater to every taste and occasion. Dive into our collection and discover new flavors, techniques, and cooking adventures awaiting you.</p>
</div>

        <div className="footer-links">

            <div className="links-group links-group-2">
                <h3>Our Services</h3>
                <Link to="/pricing">Pricing</Link>
                <Link to="/contact">Report a Bug</Link>
                <Link to="/termsofservices">Terms of Services</Link>
            </div>

            <div className="links-group">
                <h3>Our Company</h3>
                <Link to="/contact">Reporting</Link>
                <Link to="/contact">Get In Touch</Link>
                <Link to="/contact">Management</Link>
            </div>

            <div className="links-group links-group-4">
                <h3>Address</h3>
                <p>Kanchipuram,</p>
                <p>TamilNadu</p>
                <p>codersarogmail.com</p>
            </div>
        </div>
    </footer>
    </div>
   </div>

    </>
  );
};

export default LandingPage;

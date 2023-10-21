import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for the "Go to Home" link
import './NotFound404.css'


const NotFound404 = () => {
  return (
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="col-sm-10 col-sm-offset-1 text-center">
              <div className="four_zero_four_bg">
                <h1 className="text-center">404</h1>
              </div>

              <div className="contant_box_404">
                <h3 className="h2">
                  Look like you're lost
                </h3>

                <p>The page you are looking for is not available!</p>

                <Link to="/" className="link_404">Go to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound404;

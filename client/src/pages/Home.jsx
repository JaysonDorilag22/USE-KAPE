import React from "react";
import { Link } from "react-router-dom";
import slide1 from "../assets/images/slide1.jpg";
import slide2 from "../assets/images/slide2.jpg";
import slide3 from "../assets/images/slide3.jpg";
import hero from "../assets/images/hero.jpg";
import home from "../assets/images/home.jpg";
import CategoryList from "../components/ecommerce/category/CategoryList";


export default function Home() {
  return (
    <div>
    <CategoryList/>
      <div
        className="hero min-h-screen"
        style={{ backgroundImage: `url(${home})` }}
      >
        <div className="hero-content flex-col lg:flex-row-reverse text-white">
          <img src={hero} className="max-w-sm rounded-lg shadow-2xl" />
          <div>
            <h1 className="text-5xl font-bold">Welcome to useKape!</h1>
            <p className="py-6">
              "Welcome to UseKape, where your coffee journey begins. Explore,
              brew, and enjoy the perfect cup with us!"
            </p>
          </div>
        </div>
      </div>
      <div className="carousel w-full">
        <div id="slide1" className="carousel-item relative w-full">
          <img src={slide1} className="w-full" />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img src={slide2} className="w-full" />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide3" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide3" className="carousel-item relative w-full">
          <img src={slide3} className="w-full" />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide4" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

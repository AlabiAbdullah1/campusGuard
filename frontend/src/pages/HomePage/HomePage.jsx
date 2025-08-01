// import {SearchBar} from "../../components/SearchBar/SearchBar";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import LandSlide from "../../assets/landslide.svg";
import Cyclone from "../../assets/cyclone.svg";
import Flood from "../../assets/flood.svg";
import Tsunami from "../../assets/tsunami.svg";
import Fire from "../../assets/fire.svg";
import AddBoxIcon from '@mui/icons-material/AddBox';
import MapIcon from "@mui/icons-material/Map";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";

export const HomePage = () => {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  const [imageSrc, setImageSrc] = useState(Flood);

  useEffect(() => {
    const images = [Flood, LandSlide, Cyclone, Tsunami, Fire]; // Array of images to cycle through
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      setImageSrc(images[currentIndex]);
    }, 20000); // 25 seconds in milliseconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="homePage">
      <div className="textPart">
        <div className="wrapper">
          <h1 className="title">
            Keeping Our Campus Safe, Together <br />
            <span>Campus Guard</span>
          </h1>
          <p>
            Campus Guard is designed to empower the university community with a
            sense of safety and solidarity. Whether it’s an emergency, a safety
            concern, or important campus updates, our platform ensures you can
            report incidents quickly, receive timely alerts, and access crucial
            resources. Together, we can build a safer, more resilient campus for
            everyone. Stay alert, stay safe with Campus Guard.
          </p>
          {/* <SearchBar />         */}
          <div className="hero-btn">
            <Link to={"/news"}>
              Latest Updates <ViewCarouselIcon className="icon" />
            </Link>
            {/* <Link to={"/map"}>
              Disaster Map <MapIcon className="icon" />
            </Link> */}
            <Link to={currentUser ? "/report" : "/signin"}>Report Incident <AddBoxIcon className="icon"/></Link>
          </div>
        </div>
      </div>
      <div className="imagePart">
        <img src={imageSrc} alt="Flood" />
      </div>
    </div>
  );
};

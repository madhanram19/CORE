import React, { Component, Fragment, useState, useRef, useEffect, createRef  } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route ,NavLink} from "react-router-dom";
import { InputGroupAddon, Button, InputGroup, Input} from 'reactstrap';
import logo from '../../assets/images/logo.png';
import ftrSclIcon1 from '../../assets/images/ftr-scl-icon1.svg';
import ftrSclIcon2 from '../../assets/images/ftr-scl-icon2.svg';
import ftrSclIcon3 from '../../assets/images/ftr-scl-icon3.svg';
import ftrSclIcon4 from '../../assets/images/ftr-scl-icon4.svg';
import { useGetContentsQuery, useGetSiteSettingsURLMutation } from "../../views/redux/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Footer = (props) => {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetContentsQuery();
    const [getURL] = useGetSiteSettingsURLMutation();
  
    const [URLLink, setURLLink] = useState([]);
  
    useEffect(() => {
      const fetchignURL = async () => {
        try {
          const urlResponse = await getURL();
          if (urlResponse.error) {
            return toast.error("URL Fetching ERROR");
          }
          setURLLink(urlResponse.data.siteSettingsResponse);
        } catch (error) {
          console.log(error.message);
        }
      };
      fetchignURL();
    }, []);
  
    console.log(URLLink);
   
    const contents = data?.data;
    const footer = contents?.find((content) => content.content === "footer");
    console.log(footer);

    if(isLoading){
        <p>Loading...........</p>
    }
     
    React.useEffect(() => { window.scrollTo(0, 0);}, []);
    return (
        <Fragment>
           <footer>
                <div className="FootrSec">
                    <div className="container container-1200">
                        <div className="row align-items-end">
                            <div className="col-lg-8 mb-3">
                                <div className="Ftrlogo mb-3 mb-sm-5">
                                    <a href="#"><img src={logo} alt="#" /></a>
                                </div>
                                <div className="FootrCnt col-lg-9 pl-0 mb-4 pb-1">
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh elementum viverra elementum a, id ut magna.</p>
                                </div>
                                <div className="FtrLnkSec">
                                    <div className="FtrLnkHdd">
                                        <h4>Quick Links</h4>
                                    </div>
                                    <div className="FtrLnkCnt">
                                        <ul className="navbar-nav nav">
                                            <li className="nav-item">
                                                <a className="nav-link" href="">Stake</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="">Governance</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="">Neo Banking</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="">FAQ</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">About US</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Terms of Use</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Privacy Policy</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" href="#">Contact US</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 ml-lg-auto">
                                <div className="FtrLnkHdd mb-3">
                                    <h4>Follow US</h4>
                                </div>
                                <div className="SclIconSec">
                                <ul class="list-unstyled d-flex justify-content-center mb-0 ">
                  <li>
                    <a
                      target={URLLink === null ? "" : "_blank"}
                      href={URLLink === null ? " " : URLLink.faceBookUrl}
                    >
                      <i class="fab fa-facebook "></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href={URLLink === null ? "#" : URLLink.whatsAppUrl}
                      target={URLLink === null ? "" : "_blank"}
                    >
                      <i class="fab fa-whatsapp"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      target={URLLink === null ? "" : "_blank"}
                      href={URLLink === null ? "#" : URLLink.telegramUrl}
                    >
                      <i class="fab fa-telegram "></i>
                    </a>
                  </li>
                  <li>
                    <a
                      href={URLLink === null ? "#" : URLLink.instagramUrl}
                      target={URLLink === null ? "" : "_blank"}
                    >
                      <i class="fab fa-instagram "></i>
                    </a>
                  </li>
                </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="CpyRtSec py-2 py-sm-4">
                    <div className="container container-1200">
                        <div className="CpyRtCnt text-center">
                        <p  dangerouslySetInnerHTML={{ __html: footer?.editorData }}></p>
                        </div>
                    </div>
                </div>
            </footer>     
        </Fragment>
    );
   
}

export default Footer;
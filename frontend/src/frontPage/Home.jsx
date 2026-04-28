import React, { useState, useEffect } from "react";
import Hero from "../frontComponents/Hero";
import UserAbout from "../frontComponents/About";
import UserSkills from "../frontComponents/Skills";
import UserProjects from "../frontComponents/Project";
import UserContact from "../frontComponents/Contact";
import Footer from "../frontComponents/Footer";
import '../style/frontendStyle/style.css'



export const Home =()=>{


    return(
       <div className="maincontent">
         <Hero/>
         <UserAbout/>
         <UserSkills/>
         <UserProjects/>
         <UserContact/>
         <Footer/>
       </div>
       
    )
}

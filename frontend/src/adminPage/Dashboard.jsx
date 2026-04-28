import React from "react";
import AdminHero from "../adminComponents/Hero";
import AdminAbout from "../adminComponents/About";
import AdminSkills from "../adminComponents/Skills";
import AdminProjects from "../adminComponents/Project";
import AdminContact from "../adminComponents/Contact";
import '../style/adminStyle/style.css'
import FooterForm from "../adminComponents/FooterForm";

export const DashBoard = () =>{
    return(
        <>
         <div className="container">
           <AdminHero/>
          <AdminAbout/>
          <AdminSkills/>
          <AdminProjects/>
          <AdminContact/>
          <FooterForm/>
         </div>
        </>
    )
}
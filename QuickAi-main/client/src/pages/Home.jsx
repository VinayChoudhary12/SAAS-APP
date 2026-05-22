import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from "../components/AiTools"
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'
const Home = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Hero></Hero>
      <AiTools></AiTools>
      <Testimonial></Testimonial>
      <Plan></Plan>
      <Footer></Footer>
    </div>
  )
}

export default Home;

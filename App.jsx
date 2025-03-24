import React from 'react';
import './index.css';

function App() {
  return (
    <div className="app">
      <nav>
        <div className="logo">MLab Technical Service</div>
        <div className="nav-links">
          <a href="#home" className="active">Home</a>
          <a href="#about">About Us</a>
          <a href="#products">Products</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <main>
        <section id="home" className="section">
          <h1>Welcome to MLab Technical Service</h1>
          <p className="subtitle">Professional Technical Solutions for Your Business</p>
          <div className="quick-links">
            <a href="#about" className="btn">Learn More</a>
            <a href="#products" className="btn">Browse Products</a>
            <a href="#contact" className="btn">Contact Us</a>
          </div>
        </section>

        <section id="about" className="section">
          <h2>About Us</h2>
          <div className="about-content">
            <div className="about-item">
              <h3>Professional Services</h3>
              <p>We are Western Australia's leading provider of laboratory consumables and technical services, specializing in high-quality solutions for mining and laboratory sectors.</p>
            </div>
            <div className="about-item">
              <h3>Quality Assurance</h3>
              <p>All our products undergo rigorous quality control to ensure compliance with international standards and customer requirements.</p>
            </div>
            <div className="about-item">
              <h3>Technical Support</h3>
              <p>Our professional team is always available to provide technical consultation and support services.</p>
            </div>
          </div>
        </section>

        <section id="products" className="section">
          <h2>Our Products</h2>
          <div className="product-categories">
            <div className="category">
              <h3>Fire Assay Consumables</h3>
              <p>High-quality crucibles and cupels for all fire assay analysis needs.</p>
              <a href="/geological-consumables" className="category-link">Learn More</a>
            </div>
            <div className="category">
              <h3>Laboratory Consumables</h3>
              <p>Comprehensive laboratory supplies for daily experimental needs.</p>
              <a href="/lab-consumables" className="category-link">Learn More</a>
            </div>
            <div className="category">
              <h3>Safety Equipment</h3>
              <p>Professional safety protection equipment for laboratory security.</p>
              <a href="/safety-consumables" className="category-link">Learn More</a>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <h2>Contact Us</h2>
          <div className="contact-container">
            <div className="contact-info">
              <h3>Contact Information</h3>
              <p><i className="fas fa-map-marker-alt"></i> Perth, Western Australia</p>
              <p><i className="fas fa-phone"></i> +61 8 XXXX XXXX</p>
              <p><i className="fas fa-envelope"></i> info@mlab-technical.com.au</p>
            </div>
            <div className="contact-form">
              <form id="contactForm" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" required></textarea>
                </div>
                <button type="submit" className="btn">Send Message</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 MLab Technical Service. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
// 📌 components/Footer.js
import React from "react";
import { Link } from "react-router-dom";  // For navigation links
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";  // For social media icons
import "../styles/Footer.css";  // Make sure to create and import the necessary CSS

const Footer = () => {
  return (
    <footer className="footer">
      {/* Branding Section */}
      <div className="footer-branding">
        <h2>InventoryApp</h2>
        <p>Your trusted partner for inventory management solutions.</p>
      </div>

      {/* Quick Links Section */}
      <div className="footer-links">
        <div className="footer-column">
          <h3>Company</h3>
          <ul>
            <li><Link to="/about-us">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/careers">Careers</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Legal</h3>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>Products</h3>
          <ul>
            <li><Link to="/features">Features</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/demo">Request a Demo</Link></li>
          </ul>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="footer-social">
        <h3>Follow Us</h3>
        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={24} />
          </a>
        </div>
      </div>

      {/* Newsletter Subscription */}
      <div className="footer-newsletter">
        <h3>Subscribe to Our Newsletter</h3>
        <form>
          <input type="email" placeholder="Enter your email" />
          <button type="submit">Subscribe</button>
        </form>
      </div>

      {/* Contact and Location */}
      <div className="footer-contact">
        <h3>Contact</h3>
        <p>Location: RWANDA, Kimironko, KIGALI City</p>
        <p>Email: support@inventoryapp.com</p>
        <p>Phone: (+250) 782-687-241</p>
      </div>

      {/* Copyright Information */}
      <div className="footer-copyright">
        <p>&copy; 2025 InventoryApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

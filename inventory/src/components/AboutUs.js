import React from "react";
import "../styles/AboutUs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWarehouse,
  faBullseye,
  faLightbulb,
  faListUl,
  faUsers,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Card, Row, Col } from "antd";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Kayiranga Ernest",
      role: "Lead Developer",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Niyitegeka Theogene",
      role: "Supply Chain Expert",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Nyirahabimana Janviere",
      role: "Customer Support",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="about-container">
      <section className="about-header">
        <h1>About Our Inventory Management System</h1>
        <p>Efficient, Reliable, and Scalable Inventory Solutions</p>
      </section>

      <section className="about-content">
        <div className="company-overview">
          <h2>
            <FontAwesomeIcon icon={faWarehouse} className="section-icon" /> Company
            Overview
          </h2>
          <p>
            Our Inventory Management System is designed to help businesses track,
            manage, and optimize their stock levels efficiently. Whether you're
            handling retail, warehouses, or manufacturing, our solution ensures
            seamless stock movement and reporting.
          </p>
        </div>

        <div className="mission-vision">
          <h2>
            <FontAwesomeIcon icon={faBullseye} className="section-icon" /> Our
            Mission & Vision
          </h2>
          <p>
            <strong>Mission:</strong> To provide businesses with intuitive
            inventory solutions that boost productivity and reduce stock
            discrepancies.
          </p>
          <p>
            <strong>Vision:</strong> To be the leading provider of smart inventory
            management software that adapts to the ever-changing needs of
            businesses.
          </p>
        </div>

        <div className="core-features">
          <h2>
            <FontAwesomeIcon icon={faLightbulb} className="section-icon" /> Core
            Features
          </h2>
          <ul>
            <li>
              <FontAwesomeIcon icon={faListUl} className="feature-icon" />
              Real-time Stock Tracking
            </li>
            <li>
              <FontAwesomeIcon icon={faListUl} className="feature-icon" />
              Automated Stock Alerts
            </li>
            <li>
              <FontAwesomeIcon icon={faListUl} className="feature-icon" />
              Comprehensive Reports & Analytics
            </li>
            <li>
              <FontAwesomeIcon icon={faListUl} className="feature-icon" />
              Multi-user Role Management
            </li>
            <li>
              <FontAwesomeIcon icon={faListUl} className="feature-icon" />
              Seamless Integration with Other Systems
            </li>
          </ul>
        </div>

        <div className="team-section">
          <h2>
            <FontAwesomeIcon icon={faUsers} className="section-icon" /> Meet Our
            Team
          </h2>
          <Row gutter={[16, 16]}>
            {teamMembers.map((member, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card className="team-member">
                  <img src={member.image} alt={member.name} />
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className="contact-info">
          <h2>
            <FontAwesomeIcon icon={faEnvelope} className="section-icon" /> Contact
            Us
          </h2>
          <p>
            <FontAwesomeIcon icon={faEnvelope} className="contact-icon" /> Email:
            support@inventorysystem.com
          </p>
          <p>
            <FontAwesomeIcon icon={faPhone} className="contact-icon" /> Phone:
            (+250) 782687241
          </p>
          <p>
            <FontAwesomeIcon icon={faMapMarkerAlt} className="contact-icon" />
            Address: Kg113, Kigali City, RWANDA
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
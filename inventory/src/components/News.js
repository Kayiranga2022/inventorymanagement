import React from "react";
import "../styles/News.css";
import { Card, Row, Col, Typography, Divider } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faTags,
  faNewspaper,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const { Title, Paragraph, Text } = Typography;

const News = () => {
  const newsArticles = [
    {
      title: "Enhanced Stock Alert System Launched",
      date: "Jan 15, 2025",
      tags: ["Updates", "Features"],
      content:
        "We are excited to announce the launch of our enhanced stock alert system, designed to provide real-time notifications for low stock levels and prevent stockouts.",
      image: "https://images.unsplash.com/photo-1550751827-4c808a60326f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80", // Stock alert image
      link: "/news/enhanced-alerts",
    },
    {
      title: "Integration with Major E-commerce Platforms",
      date: "Feb 28, 2025",
      tags: ["Integrations", "Partnerships"],
      content:
        "Our platform now seamlessly integrates with major e-commerce platforms, allowing for synchronized inventory management across all sales channels.",
      image: "https://images.unsplash.com/photo-1587820253457-a4b868c2d159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80", // Ecommerce integration image
      link: "/news/ecommerce-integration",
    },
    {
      title: "New Analytics Dashboard Released",
      date: "Mar 10, 2025",
      tags: ["Analytics", "Dashboards"],
      content:
        "We have released a new analytics dashboard that provides deeper insights into your inventory performance, enabling data-driven decision-making.",
      image: "https://images.unsplash.com/photo-1551288033-e98f6208c170?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80", // Analytics dashboard image
      link: "/news/analytics-dashboard",
    },
    // Add more news articles here
  ];

  return (
    <div className="news-container">
      <Typography>
        <Title level={2} className="news-title">
          <FontAwesomeIcon icon={faNewspaper} className="news-icon" /> Latest News
        </Title>
      </Typography>
      <Divider />
      <Row gutter={[24, 24]}>
        {newsArticles.map((article, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card hoverable cover={<img alt={article.title} src={article.image} />}>
              <Typography>
                <Title level={4}>{article.title}</Title>
                <Paragraph>
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="news-item-icon"
                  />{" "}
                  <Text type="secondary">{article.date}</Text>
                </Paragraph>
                <Paragraph>
                  <FontAwesomeIcon icon={faTags} className="news-item-icon" />{" "}
                  {article.tags.map((tag, tagIndex) => (
                    <Text key={tagIndex} code>
                      {tag}
                    </Text>
                  ))}
                </Paragraph>
                <Paragraph>{article.content}</Paragraph>
                <a href={article.link} className="read-more-link">
                  Read More <FontAwesomeIcon icon={faArrowRight} />
                </a>
              </Typography>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default News;
import React, { useState, useEffect, useRef, useMemo } from "react";
import "./App.css"; // We'll keep your existing CSS file and add new styles
import emailjs from "emailjs-com";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as d3 from "d3";

// Navigation Component
// Navigation Component
// Navigation Component
const Navigation = ({ activeSection, setActiveSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sections = useMemo(
    () => [
      { id: "home", label: "Home" },
      { id: "about", label: "About" },
      { id: "experience", label: "Experience" },
      { id: "education", label: "Education" },
      { id: "skills", label: "Skills" },
      { id: "projects", label: "Projects" },
      { id: "certificates", label: "Certificates" },
      { id: "contact", label: "Contact" },
    ],
    []
  );
  const scrollLineRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const lineHeight = scrollLineRef.current?.offsetHeight || 0;
      const progressInPixels = (scrollPosition / docHeight) * lineHeight;

      setScrollProgress(progressInPixels);

      // Active section logic (unchanged)
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop - 100 &&
            scrollPosition < offsetTop + offsetHeight - 100
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections, setActiveSection]);

  useEffect(() => {
    const body = document.body;
    const storedTheme = localStorage.getItem("dark-mode");
    if (storedTheme === "true") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }, []);

  const toggleTheme = (e) => {
    const isChecked = e.target.checked;
    const body = document.body;
    if (isChecked) {
      body.classList.add("dark-mode");
      localStorage.setItem("dark-mode", "true");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("dark-mode", "false");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const bubblesContainer = document.createElement("div");
    bubblesContainer.className = "bubbles";
    for (let i = 0; i < 7; i++) {
      const bubble = document.createElement("div");
      bubble.className = "bubble";
      bubblesContainer.appendChild(bubble);
    }
    document.body.appendChild(bubblesContainer);
    return () => {
      document.body.removeChild(bubblesContainer);
    };
  }, []);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.id = "network-bg";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-2";
    canvas.style.display = "block";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let points = [];
    const mouse = { x: null, y: null };

    const createPoints = () => {
      points = [];
      for (let i = 0; i < 100; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59, 130, 246, 0.8)";
        ctx.shadowColor = "#3b82f6";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${1 - dist / 120})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        if (mouse.x && mouse.y) {
          const distMouse = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
          if (distMouse < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distMouse / 150})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createPoints();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
    createPoints();
    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      document.body.removeChild(canvas);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.querySelector(".mobile-menu");
      const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
      if (
        mobileMenu &&
        mobileNavToggle &&
        mobileMenuOpen &&
        !mobileMenu.contains(event.target) &&
        !mobileNavToggle.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="fixed-nav">
        <div className="logo">
          MK
          <label className="theme-toggle">
            <input
              type="checkbox"
              id="modeToggle"
              onChange={toggleTheme}
              defaultChecked={localStorage.getItem("dark-mode") === "true"}
            />
            <span className="slider"></span>
          </label>
        </div>
        <ul className="nav-links">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                className={`relative nav-btn ${
                  activeSection === section.id
                    ? "text-blue-500 font-semibold"
                    : ""
                }`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.label}
                {activeSection === section.id && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div
          className="mobile-nav-toggle"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* Scroll Ball and Line */}
      <div className="scroll-indicator">
        <div className="indicator-line" />
        <div
          className="indicator-ball"
          style={{
            transform: `translateY(${scrollProgress}%) translateX(-50%)`,
          }}
        />
      </div>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}
        id="mobile-menu"
      >
        <ul>
          {sections.map((section) => (
            <li key={section.id}>
              <button
                className={`relative nav-btn ${
                  activeSection === section.id
                    ? "text-blue-500 font-semibold"
                    : ""
                }`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.label}
                {activeSection === section.id && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

// Home Component with improved layout
const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: 'Hi there! I can help you navigate through this portfolio. Try asking about sections like "projects" or "skills".',
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  const getBotReply = (userInput) => {
    const input = userInput.toLowerCase().trim();

    // Keywords matching
    if (input.includes("home")) {
      return "You are currently on the Home section. This is where you can find my introduction and contact details.";
    } else if (input.includes("about")) {
      return "The About section contains information about my background, interests, and career goals.";
    } else if (input.includes("experience") || input.includes("work")) {
      return "In the Experience section, you'll find my professional journey including roles at various companies, responsibilities, and achievements.";
    } else if (input.includes("education") || input.includes("study")) {
      return "My Education section details my academic background, including my Computer Science degree and relevant coursework.";
    } else if (input.includes("skills") || input.includes("technologies")) {
      return "The Skills section showcases my technical expertise including programming languages, frameworks, and tools I'm proficient in.";
    } else if (input.includes("projects") || input.includes("portfolio")) {
      return "I've highlighted my best work in the Projects section. Each project includes details about technologies used and my contributions.";
    } else if (
      input.includes("certificates") ||
      input.includes("certification")
    ) {
      return "All my professional certifications and completed courses are listed in the Certificates section.";
    } else if (
      input.includes("contact") ||
      input.includes("email") ||
      input.includes("call")
    ) {
      return "You can reach me through the Contact section or directly at kalaimani2827@gmail.com and +91-6379518003.";
    } else if (
      input.includes("resume") ||
      input.includes("cv") ||
      input.includes("download")
    ) {
      return "You can download my resume using the 'Download Resume' button on this page.";
    } else if (input.includes("github")) {
      return "Check out my code repositories at github.com/kiruba2827";
    } else if (input.includes("linkedin")) {
      return "Connect with me on LinkedIn at linkedin.com/in/malar-kiruba-8847a0343";
    } else if (input.includes("location") || input.includes("where")) {
      return "I'm based in Chennai, Tamil Nadu, India.";
    } else if (input.includes("help") || input.includes("commands")) {
      return "You can ask about: home, about, experience, education, skills, projects, certificates, contact, resume, github, linkedin, location, or my background in web development, cloud solutions, and cybersecurity.";
    } else if (
      input.includes("hello") ||
      input.includes("hi") ||
      input.includes("hey")
    ) {
      return "Hello! How can I help you navigate through Malar Kiruba's portfolio today?";
    } else if (input.includes("thank") || input.includes("thanks")) {
      return "You're welcome! Let me know if you need anything else.";
    } else if (
      input.includes("cloud") ||
      input.includes("aws") ||
      input.includes("azure")
    ) {
      return "Malar Kiruba specializes in cloud solutions including AWS and Azure services for scalable application deployment.";
    } else if (input.includes("web") || input.includes("development")) {
      return "As a Full-Stack Developer, Malar has experience with React, Node.js, and various modern web technologies.";
    } else if (input.includes("cyber") || input.includes("security")) {
      return "Cybersecurity is one of Malar's areas of expertise, with knowledge in secure coding practices and penetration testing.";
    } else if (input.includes("clear") || input.includes("reset")) {
      setTimeout(() => {
        setMessages([
          { type: "bot", text: "Chat history cleared. How can I help you?" },
        ]);
      }, 500);
      return "Clearing chat history...";
    } else {
      return "I'm not sure I understand. Try asking about specific sections like 'projects' or 'skills', or type 'help' for guidance.";
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: inputValue }]);

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = getBotReply(inputValue);
      setMessages((prev) => [...prev, { type: "bot", text: botResponse }]);
      setIsTyping(false);
    }, 600);

    setInputValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleHelpClick = () => {
    setMessages((prev) => [
      ...prev,
      {
        type: "bot",
        text: "Here's what you can ask me about:\n• Home - Current section\n• About - My background\n• Experience - Work history\n• Education - Academic credentials\n• Skills - Technical expertise\n• Projects - Portfolio highlights\n• Certificates - Professional certifications\n• Contact - How to reach me\n• Resume - Download my CV\n\nYou can also ask about my specialties in cloud solutions, web development, and cybersecurity.",
      },
    ]);
  };

  return (
    <section className="section hero-section" id="home">
      <div className="hero-content">
        <div className="profile-container">
          <img src="/profile.jpg" alt="Profile" className="profile-img" />
        </div>
        <div className="hero-text">
          <h1 className="spinning-text">
            {"K. Malar Kiruba".split("").map((char, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                {char}
              </span>
            ))}
          </h1>
          <h2 className="profession">
            Computer Science Student & Full-Stack Developer
          </h2>
          <p className="tagline">
            Specializing in cloud solutions, web development, and cybersecurity
          </p>
          <div className="location-contact">
            <p>
              <i className="fas fa-map-marker-alt"></i> Chennai, Tamil Nadu
            </p>
            <p>
              <i className="fas fa-phone"></i> +91-6379518003
            </p>
            <p>
              <i className="fas fa-envelope"></i> kalaimani2827@gmail.com
            </p>
          </div>
          <div className="social-links">
            <a
              href="https://www.linkedin.com/in/malar-kiruba-8847a0343/?trk=opento_nprofile_details"
              target="_blank"
              rel="noopener noreferrer"
              className="social-button linkedin"
            >
              <i className="fab fa-linkedin"></i> LinkedIn
            </a>
            <a
              href="https://github.com/kiruba2827"
              target="_blank"
              rel="noopener noreferrer"
              className="social-button github"
            >
              <i className="fab fa-github"></i> GitHub
            </a>
          </div>
          <div className="resume-download">
            <a href="/Kiruba_Resume.docx" download className="download-button">
              <i className="fas fa-download"></i> Download Resume
            </a>
          </div>
        </div>
      </div>

      <div className="scroll-down">
        <span>Scroll Down</span>
        <i className="fas fa-chevron-down"></i>
      </div>

      {/* Chatbot */}
      <div className={`chatbot-wrapper ${isChatOpen ? "open" : "closed"}`}>
        <button
          className="chat-toggle-button"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {isChatOpen ? (
            <>
              <i className="fas fa-times"></i> Close Chat
            </>
          ) : (
            <>
              <i className="fas fa-comment"></i> Chat with Me
            </>
          )}
        </button>

        {isChatOpen && (
          <div className="chatbot-container">
            <div className="chatbot-header">
              <span>
                <i className="fas fa-robot"></i> Portfolio Assistant
              </span>
              <div className="chatbot-actions">
                <button
                  onClick={handleHelpClick}
                  className="help-button"
                  title="Get Help"
                >
                  <i className="fas fa-question-circle"></i>
                </button>
                <button
                  onClick={() =>
                    setMessages([
                      {
                        type: "bot",
                        text: "How can I help you navigate through this portfolio?",
                      },
                    ])
                  }
                  className="clear-button"
                  title="Clear Chat"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>

            <div className="chatbot-output" ref={outputRef}>
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.type}-message`}>
                  <div className="message-avatar">
                    {msg.type === "bot" ? (
                      <i className="fas fa-robot"></i>
                    ) : (
                      <i className="fas fa-user"></i>
                    )}
                  </div>
                  <div className="message-content">{msg.text}</div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-message bot-message typing">
                  <div className="message-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>

            <div className="chatbot-input-container">
              <input
                type="text"
                placeholder="Ask about my portfolio..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                ref={inputRef}
                className="chatbot-input"
              />
              <button
                onClick={handleSendMessage}
                className="send-button"
                disabled={!inputValue.trim()}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
// About Component with visual enhancements
const About = () => {
  const graphRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Skill details for modal content
  const skillDetails = {
    fullstack: {
      title: "Full-Stack Development",
      description:
        "Building end-to-end web applications using modern frameworks and technologies. Creating seamless user experiences with responsive design.",
      experience: "4+ years of experience developing full-stack applications",
      keyTechnologies: [
        "React",
        "Node.js",
        "Express",
        "MongoDB",
        "Django",
        "RESTful APIs",
      ],
      projects: [
        "Portfolio Website",
        "E-commerce Platform",
        "Inventory Management System",
      ],
    },
    cloud: {
      title: "Cloud Solutions",
      description:
        "Designing and implementing scalable cloud infrastructure. Creating efficient deployment pipelines and optimizing resource utilization.",
      experience: "3+ years working with cloud platforms",
      keyTechnologies: [
        "Oracle Cloud",
        "OpenStack",
        "Hadoop",
        "Containerization",
        "Auto-scaling",
      ],
      projects: [
        "Cloud Migration Project",
        "Distributed Database System",
        "Serverless API Implementation",
      ],
    },
    security: {
      title: "Security",
      description:
        "Implementing robust security measures to protect data and systems. Conducting security audits and addressing vulnerabilities.",
      experience: "3 years of cybersecurity implementation",
      keyTechnologies: [
        "OWASP Top 10",
        "Ethical Hacking",
        "Penetration Testing",
        "Encryption",
        "Firewall Configuration",
      ],
      projects: [
        "Security Audit System",
        "Zero-Trust Network Implementation",
        "Secure Authentication Service",
      ],
    },
    react: {
      title: "React",
      description:
        "Building modern, responsive user interfaces with React's component-based architecture.",
      experience: "3+ years of React development",
      keyTechnologies: [
        "React Hooks",
        "Context API",
        "Redux",
        "Material UI",
        "Styled Components",
      ],
      projects: [
        "Interactive Dashboard",
        "Single Page Application",
        "Progressive Web App",
      ],
    },
    node: {
      title: "Node.js",
      description:
        "Creating scalable backend services using JavaScript on the server-side with Node.js.",
      experience: "3 years of Node.js development",
      keyTechnologies: [
        "Express.js",
        "Socket.io",
        "Mongoose",
        "JWT Authentication",
        "Microservices",
      ],
      projects: [
        "RESTful API Service",
        "Real-time Chat Application",
        "Authentication System",
      ],
    },
    express: {
      title: "Express",
      description:
        "Building robust web APIs and middleware using Express.js framework.",
      experience: "3 years using Express.js",
      keyTechnologies: [
        "Middleware",
        "Routing",
        "Error Handling",
        "API Design",
        "MVC Pattern",
      ],
      projects: [
        "Backend Service API",
        "Authentication Middleware",
        "Data Processing Service",
      ],
    },
    mongodb: {
      title: "MongoDB",
      description:
        "Implementing NoSQL database solutions with MongoDB for flexible data storage.",
      experience: "3 years working with MongoDB",
      keyTechnologies: [
        "Document Modeling",
        "Aggregation Pipeline",
        "Indexing",
        "Mongoose ODM",
        "Replication",
      ],
      projects: [
        "Content Management System",
        "User Data Store",
        "Analytics Database",
      ],
    },
    django: {
      title: "Django",
      description:
        "Creating Python-based web applications with Django's powerful features.",
      experience: "2 years of Django development",
      keyTechnologies: [
        "Django ORM",
        "Django REST Framework",
        "Templates",
        "Authentication",
        "Admin Panel",
      ],
      projects: [
        "Content Management System",
        "Data Analysis Dashboard",
        "Automated Reporting Tool",
      ],
    },
    rest: {
      title: "RESTful APIs",
      description:
        "Designing and implementing RESTful services for seamless integration between systems.",
      experience: "4+ years building RESTful APIs",
      keyTechnologies: [
        "REST Principles",
        "API Versioning",
        "Documentation",
        "Rate Limiting",
        "HATEOAS",
      ],
      projects: [
        "Integration Services",
        "Third-party API Connectors",
        "Mobile App Backend",
      ],
    },
    oracle: {
      title: "Oracle Cloud",
      description:
        "Leveraging Oracle Cloud Infrastructure to build scalable and reliable applications.",
      experience: "2 years working with Oracle Cloud",
      keyTechnologies: [
        "Compute",
        "Storage",
        "Networking",
        "Database",
        "Load Balancing",
      ],
      projects: [
        "Enterprise Application Hosting",
        "Disaster Recovery System",
        "Database Migration",
      ],
    },
    openstack: {
      title: "OpenStack",
      description:
        "Creating private cloud solutions with OpenStack's open-source platform.",
      experience: "2 years implementing OpenStack",
      keyTechnologies: ["Nova", "Swift", "Neutron", "Keystone", "Heat"],
      projects: [
        "Private Cloud Setup",
        "Virtual Machine Management",
        "Software-Defined Networking",
      ],
    },
    hadoop: {
      title: "Hadoop",
      description:
        "Processing and analyzing large datasets with Hadoop's distributed computing framework.",
      experience: "2 years working with Hadoop ecosystem",
      keyTechnologies: ["HDFS", "MapReduce", "Hive", "Spark", "Yarn"],
      projects: [
        "Big Data Processing Pipeline",
        "Log Analysis System",
        "Batch Processing System",
      ],
    },
    container: {
      title: "Containerization",
      description:
        "Packaging applications and dependencies into portable containers for consistent deployment.",
      experience: "3 years of containerization experience",
      keyTechnologies: [
        "Docker",
        "Kubernetes",
        "Docker Compose",
        "Container Orchestration",
        "Microservices",
      ],
      projects: [
        "Microservices Architecture",
        "CI/CD Pipeline",
        "Service Mesh Implementation",
      ],
    },
    scaling: {
      title: "Auto-scaling",
      description:
        "Implementing automated scaling solutions to handle varying workloads efficiently.",
      experience: "2+ years implementing auto-scaling solutions",
      keyTechnologies: [
        "Horizontal Scaling",
        "Vertical Scaling",
        "Load Balancing",
        "Resource Monitoring",
        "Performance Optimization",
      ],
      projects: [
        "Traffic Surge Management",
        "Resource Optimization System",
        "Cost-effective Scaling Solution",
      ],
    },
    owasp: {
      title: "OWASP Security",
      description:
        "Applying OWASP guidelines to build secure web applications and protect against common vulnerabilities.",
      experience: "3 years working with OWASP standards",
      keyTechnologies: [
        "Injection Prevention",
        "XSS Protection",
        "CSRF Mitigation",
        "Secure Authentication",
        "Security Headers",
      ],
      projects: [
        "Security Compliance System",
        "Vulnerability Scanner",
        "Security Training Platform",
      ],
    },
    ethical: {
      title: "Ethical Hacking",
      description:
        "Using ethical hacking techniques to identify and address security vulnerabilities.",
      experience: "2 years of ethical hacking practice",
      keyTechnologies: [
        "Penetration Testing",
        "Vulnerability Assessment",
        "Social Engineering",
        "Network Scanning",
        "Security Auditing",
      ],
      projects: [
        "Security Assessment Tool",
        "Penetration Testing Framework",
        "Security Reporting System",
      ],
    },
    penetration: {
      title: "Penetration Testing",
      description:
        "Conducting thorough penetration tests to discover and remediate security weaknesses.",
      experience: "2 years of penetration testing",
      keyTechnologies: [
        "Web Application Testing",
        "Network Testing",
        "Exploitation",
        "Privilege Escalation",
        "Post-Exploitation",
      ],
      projects: [
        "Automated Security Scanner",
        "Compliance Testing Tool",
        "Vulnerability Management System",
      ],
    },
    encryption: {
      title: "Encryption",
      description:
        "Implementing strong encryption to protect sensitive data both at rest and in transit.",
      experience: "3 years of encryption implementation",
      keyTechnologies: [
        "Symmetric Encryption",
        "Asymmetric Encryption",
        "Hashing",
        "PKI",
        "TLS/SSL",
      ],
      projects: [
        "Secure Communication System",
        "Data Protection Service",
        "Key Management Solution",
      ],
    },
    firewall: {
      title: "Firewall",
      description:
        "Configuring and managing firewalls to protect networks and systems from unauthorized access.",
      experience: "2 years of firewall management",
      keyTechnologies: [
        "Network Filtering",
        "Application Firewall",
        "Packet Inspection",
        "Rule Management",
        "Intrusion Prevention",
      ],
      projects: [
        "Network Security System",
        "Zero-Trust Implementation",
        "Segmentation Strategy",
      ],
    },
  };

  useEffect(() => {
    // Capture the current value of the ref
    const currentRef = graphRef.current;

    if (currentRef) {
      createForceDirectedGraph();
    }

    // Clean up function using the captured value
    return () => {
      if (currentRef) {
        d3.select(currentRef).selectAll("*").remove();
      }
    };
  });

  const handleNodeClick = (nodeData) => {
    setSelectedSkill(nodeData.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const createForceDirectedGraph = () => {
    // Clear any existing SVG
    d3.select(graphRef.current).selectAll("*").remove();

    // Graph data - skills clusters
    const data = {
      nodes: [
        // Main clusters
        { id: "fullstack", group: 1, label: "Full-Stack", size: 22 },
        { id: "cloud", group: 2, label: "Cloud", size: 22 },
        { id: "security", group: 3, label: "Security", size: 22 },

        // Full-stack related skills
        { id: "react", group: 1, label: "React", size: 14 },
        { id: "node", group: 1, label: "Node.js", size: 14 },
        { id: "express", group: 1, label: "Express", size: 12 },
        { id: "mongodb", group: 1, label: "MongoDB", size: 12 },
        { id: "django", group: 1, label: "Django", size: 14 },
        { id: "rest", group: 1, label: "RESTful APIs", size: 16 },

        // Cloud related skills
        { id: "oracle", group: 2, label: "Oracle Cloud", size: 14 },
        { id: "openstack", group: 2, label: "OpenStack", size: 14 },
        { id: "hadoop", group: 2, label: "Hadoop", size: 12 },
        { id: "container", group: 2, label: "Containerization", size: 14 },
        { id: "scaling", group: 2, label: "Auto-scaling", size: 12 },

        // Security related skills
        { id: "owasp", group: 3, label: "OWASP", size: 14 },
        { id: "ethical", group: 3, label: "Ethical Hacking", size: 14 },
        { id: "penetration", group: 3, label: "Penetration Testing", size: 12 },
        { id: "encryption", group: 3, label: "Encryption", size: 12 },
        { id: "firewall", group: 3, label: "Firewall", size: 12 },
      ],
      links: [
        // Connect main clusters to related skills
        { source: "fullstack", target: "react", value: 5 },
        { source: "fullstack", target: "node", value: 5 },
        { source: "fullstack", target: "express", value: 4 },
        { source: "fullstack", target: "mongodb", value: 4 },
        { source: "fullstack", target: "django", value: 5 },
        { source: "fullstack", target: "rest", value: 5 },

        { source: "cloud", target: "oracle", value: 5 },
        { source: "cloud", target: "openstack", value: 5 },
        { source: "cloud", target: "hadoop", value: 4 },
        { source: "cloud", target: "container", value: 5 },
        { source: "cloud", target: "scaling", value: 4 },

        { source: "security", target: "owasp", value: 5 },
        { source: "security", target: "ethical", value: 5 },
        { source: "security", target: "penetration", value: 4 },
        { source: "security", target: "encryption", value: 4 },
        { source: "security", target: "firewall", value: 4 },

        // Connect related nodes within clusters
        { source: "react", target: "node", value: 3 },
        { source: "node", target: "express", value: 3 },
        { source: "express", target: "mongodb", value: 3 },
        { source: "rest", target: "express", value: 3 },
        { source: "rest", target: "django", value: 3 },

        { source: "oracle", target: "container", value: 3 },
        { source: "openstack", target: "scaling", value: 3 },
        { source: "hadoop", target: "scaling", value: 3 },

        { source: "owasp", target: "ethical", value: 3 },
        { source: "ethical", target: "penetration", value: 3 },
        { source: "encryption", target: "firewall", value: 3 },

        // Cross-cluster connections
        { source: "rest", target: "oracle", value: 2 },
        { source: "container", target: "encryption", value: 2 },
        { source: "node", target: "hadoop", value: 2 },
      ],
    };

    // Set dimensions
    const width = graphRef.current.clientWidth;
    const height = 350;

    // Create SVG
    const svg = d3
      .select(graphRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("class", "skills-graph");

    // Add a gradient definition
    const defs = svg.append("defs");

    // Add the missing background gradient
    const backgroundGradient = defs
      .append("linearGradient")
      .attr("id", "gradient-background")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    backgroundGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f8f9fa");

    backgroundGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#e9ecef");

    // Create gradients for each group
    const gradients = {
      1: { id: "gradient-fullstack", colors: ["#4a6cf7", "#8a9af7"] },
      2: { id: "gradient-cloud", colors: ["#3acf87", "#8adfb0"] },
      3: { id: "gradient-security", colors: ["#f7774a", "#f7a98a"] },
    };

    Object.values(gradients).forEach((gradient) => {
      const gradDef = defs
        .append("linearGradient")
        .attr("id", gradient.id)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%");

      gradDef
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", gradient.colors[0]);

      gradDef
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", gradient.colors[1]);
    });

    // Add glow filter
    const filter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("height", "300%")
      .attr("width", "300%")
      .attr("x", "-100%")
      .attr("y", "-100%");

    filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "2.5")
      .attr("result", "coloredBlur");

    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Create simulation
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d) => d.id)
          .distance((d) => 120 - d.value * 10)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.size + 15)
      );

    // Create the graph background
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#gradient-background)")
      .attr("rx", 10)
      .attr("ry", 10);

    // Create links with varying opacity based on value
    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", (d) => {
        const sourceGroup = data.nodes.find(
          (n) => n.id === d.source.id || n.id === d.source
        ).group;
        const targetGroup = data.nodes.find(
          (n) => n.id === d.target.id || n.id === d.target
        ).group;

        if (sourceGroup === targetGroup) {
          switch (sourceGroup) {
            case 1:
              return "#4a6cf7";
            case 2:
              return "#3acf87";
            case 3:
              return "#f7774a";
            default:
              return "#999";
          }
        }
        return "#999";
      })
      .attr("stroke-opacity", (d) => 0.2 + d.value * 0.15)
      .attr("stroke-width", (d) => Math.sqrt(d.value) * 0.8);

    // Create node groups
    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")
      .attr("class", "node-group")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )
      .on("click", (event, d) => handleNodeClick(d));

    // Add circles to nodes with gradient fills - Fix the gradient URL
    node
      .append("circle")
      .attr("r", (d) => d.size)
      .attr("fill", (d) => `url(#${gradients[d.group].id})`) // Fixed gradient reference
      .attr("stroke", (d) => {
        switch (d.group) {
          case 1:
            return "#3451b2";
          case 2:
            return "#2a9f65";
          case 3:
            return "#c24d26";
          default:
            return "#fff";
        }
      })
      .attr("stroke-width", 2)
      .attr("filter", "url(#glow)")
      .attr("cursor", "pointer");

    // Add node labels with background for better readability
    const labels = node.append("g").attr("class", "node-label");

    // Label background
    labels
      .append("rect")
      .attr("x", (d) => -(d.label.length * 3.5 + 6) / 2)
      .attr("y", (d) => d.size + 2)
      .attr("width", (d) => d.label.length * 3.5 + 6)
      .attr("height", 16)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "rgba(255, 255, 255, 0.9)")
      .attr("stroke", (d) => {
        switch (d.group) {
          case 1:
            return "#4a6cf7";
          case 2:
            return "#3acf87";
          case 3:
            return "#f7774a";
          default:
            return "#999";
        }
      })
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.8);

    // Label text
    labels
      .append("text")
      .text((d) => d.label)
      .attr("x", 0)
      .attr("y", (d) => d.size + 14)
      .attr("text-anchor", "middle")
      .attr("font-size", (d) => Math.min(10 + d.size / 4, 12) + "px")
      .attr("font-weight", "500")
      .attr("fill", "#333")
      .attr("pointer-events", "none");

    // Add hover effect
    node
      .on("mouseover", function (event, d) {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", (d) => d.size * 1.1)
          .attr("filter", "url(#glow)");

        d3.select(this)
          .select(".node-label")
          .transition()
          .duration(200)
          .attr("transform", "scale(1.1)")
          .attr("transform-origin", "center");

        // Highlight connected links
        link
          .transition()
          .duration(200)
          .attr("stroke-opacity", (l) =>
            l.source.id === d.id || l.target.id === d.id ? 0.8 : 0.1
          )
          .attr("stroke-width", (l) =>
            l.source.id === d.id || l.target.id === d.id
              ? Math.sqrt(l.value) * 1.5
              : Math.sqrt(l.value) * 0.5
          );

        // Highlight connected nodes
        node
          .transition()
          .duration(200)
          .style("opacity", (n) => {
            // Check if this node is connected to the hovered node
            const isConnected = data.links.some(
              (l) =>
                (l.source.id === d.id && l.target.id === n.id) ||
                (l.source.id === n.id && l.target.id === d.id)
            );
            return n.id === d.id || isConnected ? 1 : 0.4;
          });
      })
      .on("mouseout", function () {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", (d) => d.size);

        d3.select(this)
          .select(".node-label")
          .transition()
          .duration(200)
          .attr("transform", "scale(1)")
          .attr("transform-origin", "center");

        // Reset link opacity and width
        link
          .transition()
          .duration(200)
          .attr("stroke-opacity", (d) => 0.2 + d.value * 0.15)
          .attr("stroke-width", (d) => Math.sqrt(d.value) * 0.8);

        // Reset all nodes opacity
        node.transition().duration(200).style("opacity", 1);
      });

    // Add title for accessibility
    node.append("title").text((d) => d.label);

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("transform", (d) => {
        // Keep nodes within bounds
        d.x = Math.max(d.size, Math.min(width - d.size, d.x));
        d.y = Math.max(d.size + 10, Math.min(height - d.size - 20, d.y));
        return `translate(${d.x},${d.y})`;
      });
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  return (
    <section className="section" id="about">
      <div className="section-header">
        <h2>About Me</h2>
        <div className="underline"></div>
      </div>
      <div className="about-content">
        <div className="about-text">
          <p>
            I'm a dynamic Computer Science student with hands-on experience at
            C-DAC, where I've developed RESTful APIs, enhanced network
            monitoring systems, and implemented security measures following
            OWASP guidelines.
          </p>
          <p>
            My expertise spans full-stack web development, cloud infrastructure,
            and network security. I excel at optimizing system performance and
            integrating complex functionalities in diverse technical
            environments.
          </p>
          <p>
            I'm seeking opportunities to apply my technical expertise where I
            can continue to grow while making meaningful contributions to
            innovative projects.
          </p>
        </div>

        <div className="skills-visualization">
          <h3>Interactive Skills Universe</h3>
          <p className="graph-instruction">
            Drag nodes to explore connections and click on any skill for more
            details
          </p>
          <div ref={graphRef} className="skills-graph-container"></div>
        </div>

        <div className="key-highlights">
          <div className="highlight-card">
            {/* Add Font Awesome script in the head section of your HTML file */}
            <i className="fas fa-code"></i>
            <h3>Full-Stack Development</h3>
            <p>MERN Stack, Django, RESTful APIs</p>
          </div>
          <div className="highlight-card">
            <i className="fas fa-cloud"></i>
            <h3>Cloud Solutions</h3>
            <p>Oracle Cloud, OpenStack, Hadoop</p>
          </div>
          <div className="highlight-card">
            <i className="fas fa-shield-alt"></i>
            <h3>Security</h3>
            <p>OWASP Top 10, Ethical Hacking</p>
          </div>
        </div>
      </div>

      {/* Skill Detail Modal */}
      {modalOpen && selectedSkill && (
        <div className="skill-modal-overlay" onClick={closeModal}>
          <div
            className="skill-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-button" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>

            <div className="modal-header">
              <h3>{skillDetails[selectedSkill].title}</h3>
              <div className="modal-underline"></div>
            </div>

            <div className="modal-body">
              <p className="skill-description">
                {skillDetails[selectedSkill].description}
              </p>

              <div className="skill-experience">
                <i className="fas fa-history"></i>
                <span>{skillDetails[selectedSkill].experience}</span>
              </div>

              <div className="skill-technologies">
                <h4>Key Technologies</h4>
                <div className="tech-tags">
                  {skillDetails[selectedSkill].keyTechnologies.map(
                    (tech, index) => (
                      <span key={index} className="tech-tag">
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="skill-projects">
                <h4>Related Projects</h4>
                <ul>
                  {skillDetails[selectedSkill].projects.map(
                    (project, index) => (
                      <li key={index}>
                        <i className="fas fa-project-diagram"></i>
                        <span>{project}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// Skills Component reorganized into categories
const Skills = () => {
  const svgRef = useRef();

  const categories = [
    {
      title: "Programming Languages",
      icon: "fas fa-laptop-code",
      color: "#4caf50",
    },
    {
      title: "Web Development & Databases",
      icon: "fas fa-server",
      color: "#2196f3",
    },
    {
      title: "Cloud & DevOps",
      icon: "fas fa-cloud",
      color: "#ff9800",
    },
    {
      title: "Security & Networks",
      icon: "fas fa-shield-alt",
      color: "#f44336",
    },
    {
      title: "Soft Skills",
      icon: "fas fa-comments",
      color: "#9c27b0",
    },
  ];

  const softSkillDescriptions = {
    "Problem Solving": "Ability to find solutions in complex situations.",
    Communication: "Effectively convey ideas and listen actively.",
    Teamwork: "Work collaboratively with others to achieve goals.",
    Adaptability: "Adjust quickly to new conditions and challenges.",
    "Critical Thinking": "Analyze facts to form a judgment.",
    Diplomacy: "Handle sensitive matters with tact and respect.",
    "Continuous Learning": "Always acquiring new knowledge and skills.",
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear existing SVG

    const width = 800;
    const height = 200;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const points = categories.map((_, i) => ({
      x: i * (width / (categories.length - 1)),
      y: height / 2 + (Math.random() * 60 - 30), // simulate ECG wave
    }));

    const line = d3
      .line()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveCardinal);

    // Draw the ECG line
    svg
      .append("path")
      .datum(points)
      .attr("fill", "none")
      .attr("stroke", "#00e676")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Draw category nodes
    svg
      .selectAll(".node")
      .data(points)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 6)
      .attr("fill", (d, i) => categories[i].color);

    // Add labels
    svg
      .selectAll(".label")
      .data(points)
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y - 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .style("font-size", "12px")
      .text((_, i) => categories[i].title);
  });

  return (
    <section className="section" id="skills">
      <div className="section-header">
        <h2>Skills & Expertise</h2>
        <div className="underline"></div>
      </div>

      <div className="ecg-graph">
        <svg ref={svgRef} className="ecg-svg"></svg>
      </div>

      <div className="skills-container">
        {/* CATEGORY TEMPLATE */}

        {[
          {
            title: "Programming Languages",

            icon: "fas fa-laptop-code",

            skills: [
              {
                name: "Python",

                level: "90%",

                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
              },

              {
                name: "JavaScript",

                level: "85%",

                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
              },

              {
                name: "Java",

                level: "80%",

                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
              },

              {
                name: "C/C++",

                level: "75%",

                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
              },

              {
                name: "HTML/CSS",

                level: "90%",

                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
              },
            ],
          },

          {
            title: "Web Development & Databases",

            icon: "fas fa-server",

            skills: [
              {
                name: "MERN Stack",

                level: "85%",

                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
              },

              {
                name: "Django",

                level: "80%",

                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
              },

              {
                name: "RESTful APIs",

                level: "90%",

                logo: "https://img.icons8.com/ios-filled/50/api.png",
              },

              {
                name: "MySQL/PostgreSQL",

                level: "85%",

                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
              },

              {
                name: "MongoDB",

                level: "80%",

                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
              },
            ],
          },

          {
            title: "Cloud & DevOps",

            icon: "fas fa-cloud",

            skills: [
              {
                name: "Oracle Cloud",

                level: "90%",

                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
              },

              {
                name: "OpenStack",

                level: "85%",

                logo: "https://img.icons8.com/color/48/openstack.png",
              },

              {
                name: "Hadoop Ecosystem",

                level: "70%",

                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg",
              },

              {
                name: "Linux (Ubuntu/RedHat)",

                level: "80%",

                logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
              },
            ],
          },

          {
            title: "Security & Networks",

            icon: "fas fa-shield-alt",

            skills: [
              {
                name: "OWASP Top 10",

                level: "85%",

                logo: "https://img.icons8.com/ios-filled/50/shield.png",
              },

              {
                name: "Packet Analysis",

                level: "80%",

                logo: "https://img.icons8.com/ios-filled/50/network-card.png",
              },

              {
                name: "Ethical Hacking",

                level: "75%",

                logo: "https://img.icons8.com/ios-filled/50/hacker.png",
              },

              {
                name: "Network Monitoring",

                level: "85%",

                logo: "https://img.icons8.com/ios-filled/50/network.png",
              },
            ],
          },
        ].map((category, i) => (
          <div className="skill-category" key={i}>
            <h3>
              <i className={category.icon}></i> {category.title}
            </h3>

            <div className="skill-grid">
              {category.skills.map((skill, j) => (
                <div className="skill-item" key={j}>
                  <div className="skill-name">
                    <img
                      src={skill.logo}
                      alt={skill.name}
                      className="skill-logo"
                    />

                    {skill.name}
                  </div>

                  <div className="skill-bar">
                    <div
                      className="skill-level"
                      style={{ width: skill.level }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="skill-category">
          <h3>
            <i className="fas fa-comments"></i> Soft Skills
          </h3>

          <div className="soft-skills">
            {[
              "Problem Solving",
              "Communication",
              "Teamwork",
              "Adaptability",
              "Critical Thinking",
              "Diplomacy",
              "Continuous Learning",
            ].map((skill, i) => (
              <div className="soft-skill-tooltip" key={i}>
                <span className="soft-skill-badge">{skill}</span>
                <div className="tooltip-text">
                  {softSkillDescriptions[skill]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <section className="section" id="tech-showcase">
        <div className="section-header">
          <h2>Technology Showcase</h2>
          <div className="underline"></div>
        </div>

        <div className="tech-showcase-grid">
          {[
            {
              name: "Python",
              gif: "https://media.giphy.com/media/KAq5w47R9rmTuvWOWa/giphy.gif",
              description: "Scripting, automation, and AI development.",
            },
            {
              name: "JavaScript",
              gif: "https://media.giphy.com/media/fsEaZldNC8A1PJ3mwp/giphy.gif",
              description: "Web interactivity and frontend frameworks.",
            },
            {
              name: "Java",
              gif: "https://media.giphy.com/media/kdFc8fubgS31b8DsVu/giphy.gif",
              description: "Enterprise-grade backend development.",
            },
            {
              name: "React",
              gif: "https://media.giphy.com/media/eNAsjO55tPbgaor7ma/giphy.gif",
              description: "Modern UI with component-based architecture.",
            },
            {
              name: "Django",
              gif: "https://media.giphy.com/media/LMt9638dO8dftAjtco/giphy.gif",
              description: "Robust Python web backend framework.",
            },
            {
              name: "MongoDB",
              gif: "https://media.giphy.com/media/du3J3cXyzhj75IOgvA/giphy.gif",
              description: "NoSQL database for flexible data storage.",
            },
            {
              name: "Linux",
              gif: "https://media.giphy.com/media/fAnEC88LccN7a/giphy.gif",
              description: "Open-source OS for servers & developers.",
            },
            {
              name: "OpenStack",
              gif: "https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif",
              description: "Cloud infrastructure management.",
            },
            {
              name: "Packet Analysis",
              gif: "https://media.giphy.com/media/yw6VnrxDFgfF2/giphy.gif",
              description: "Network traffic inspection and debugging.",
            },
            {
              name: "Hadoop",
              gif: "https://media.giphy.com/media/NFA61GS9qKZ68/giphy.gif",
              description: "Big data processing and storage.",
            },
            {
              name: "Zabbix Monitoring",
              gif: "https://media.giphy.com/media/xUA7aZeLE2e0P7Znz2/giphy.gif",
              description: "Infrastructure & resource monitoring.",
            },
            {
              name: "OWASP Top 10",
              gif: "https://media.giphy.com/media/f3iwJFOVOwuy7K6FFw/giphy.gif",
              description: "Web security vulnerability awareness.",
            },
            {
              name: "Load Balancing",
              gif: "https://media.giphy.com/media/3oriNVv5s4pTFW8vIk/giphy.gif",
              description: "Distribute traffic across servers.",
            },
            {
              name: "OS to ISO Conversion",
              gif: "https://media.giphy.com/media/26ufcYAk9YuQ9Kf3G/giphy.gif",
              description: "Create bootable installation media.",
            },
          ].map((tech, i) => (
            <div className="tech-card" key={i}>
              <img src={tech.gif} alt={tech.name} className="tech-gif" />
              <div className="tech-card-content">
                <h3>{tech.name}</h3>
                <p>{tech.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};
// Experience Component with enhanced layout
const Experience = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="section" id="experience">
      <div className="section-header">
        <h2>Professional Experience</h2>
        <div className="underline"></div>
      </div>

      <div className="timeline">
        <div className="timeline-item">
          <div className="timeline-dot"></div>
          <div className="timeline-content">
            <div className="timeline-header">
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img
                  src="/download (2).jpeg" // Make sure this path is correct or in public folder
                  alt="CDAC Logo"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "contain",
                  }}
                />
                <h3>C-DAC, Chennai, India</h3>
              </div>
              <span className="timeline-period">Dec 2024 - March 2025</span>
            </div>
            <p className="timeline-title">Software Development Intern</p>
            <div className="timeline-body">
              <ul className="timeline-list">
                <li>
                  <i className="fas fa-check-circle"></i> Developed and
                  maintained RESTful APIs for frontend integration
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Enhanced network
                  monitoring by integrating Network Topology in Meghdoot Cloud
                  Dashboard
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Created a CPU
                  Monitoring System in FSP Cloud
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Implemented security
                  measures using OWASP Top 10 guidelines
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Optimized system
                  processes using Linux and Hadoop Ecosystem
                </li>
                <li>
                  <i className="fas fa-check-circle"></i> Worked on Openstack
                  services: Horizon, Compute, Nova, Neutron, Swift
                </li>
              </ul>

              <div className="certificate-preview">
                <p>C-DAC Internship Certificate</p>
                <div
                  className="certificate-thumbnail"
                  onClick={() => setShowModal(true)}
                >
                  <img src="/cdac_cert.jpeg" alt="CDAC Certificate" />
                  <div className="view-overlay">
                    <i className="fas fa-search-plus"></i> View
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container">
            <span className="modal-close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <img
              src="/cdac_cert.jpeg"
              alt="Full Certificate"
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  );
};

// Education Component with timeline layout
const Education = () => (
  <section className="section" id="education">
    <div className="section-header">
      <h2>Education & Qualifications</h2>
      <div className="underline"></div>
    </div>

    <div className="timeline">
      <div className="timeline-item">
        <div className="timeline-dot"></div>
        <div className="timeline-content">
          <img
            src="/download (3).jpeg" // Make sure this path is correct or in public folder
            alt="CDAC Logo"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "contain",
            }}
          />
          <div className="timeline-header">
            <h3>Panimalar Engineering College, Chennai</h3>
            <span className="timeline-period">2023 - Expected 2027</span>
          </div>
          <p className="timeline-title">B.E. Computer Science & Engineering</p>
          <div className="timeline-body">
            <p>
              <strong>GPA:</strong> 8.6/10
            </p>
            <p>
              Coursework: Data Structures, Algorithms, Database Systems, Web
              Development, Computer Networks
            </p>
          </div>
        </div>
      </div>

      <div className="timeline-item">
        <div className="timeline-dot"></div>
        <div className="timeline-content">
          <img
            src="/download (4).jpeg" // Make sure this path is correct or in public folder
            alt="CDAC Logo"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "contain",
            }}
          />
          <div className="timeline-header">
            <h3>Velammal MHSS, Chennai</h3>
            <span className="timeline-period">2021 - 2023</span>
          </div>
          <p className="timeline-title">Higher Secondary (HSC)</p>
          <div className="timeline-body">
            <p>
              <strong>Score:</strong> 90%
            </p>
            <p>Majors: Mathematics, Physics, Chemistry, Computer Science</p>
          </div>
        </div>
      </div>

      <div className="timeline-item">
        <div className="timeline-dot"></div>
        <div className="timeline-content">
          <img
            src="/download (4).jpeg" // Make sure this path is correct or in public folder
            alt="CDAC Logo"
            style={{
              width: "40px",
              height: "40px",
              objectFit: "contain",
            }}
          />
          <div className="timeline-header">
            <h3>Velammal MHSS, Chennai</h3>
            <span className="timeline-period">2021</span>
          </div>
          <p className="timeline-title">SSLC</p>
        </div>
      </div>
    </div>
  </section>
);

// Projects Component with cards
const Projects = () => (
  <section className="section" id="projects">
    <div className="section-header">
      <h2>Projects</h2>
      <div className="underline"></div>
    </div>

    <div className="projects-grid">
      <div className="project-card">
        <div className="project-icon">
          <i className="fas fa-code"></i>
        </div>
        <h3>MERN Stack Mini Project</h3>
        <p>
          A full-stack web application utilizing MongoDB, Express, React, and
          Node.js for seamless frontend and backend integration.
        </p>
        <div className="project-techs">
          <span>MongoDB</span>
          <span>Express</span>
          <span>React</span>
          <span>Node.js</span>
        </div>
      </div>

      <div className="project-card">
        <div className="project-icon">
          <i className="fab fa-java"></i>
        </div>
        <h3>Whac-A-Mole Game</h3>
        <p>
          Interactive Java-based game implementing object-oriented programming
          concepts with responsive user interface and score tracking system.
        </p>
        <div className="project-techs">
          <span>Java</span>
          <span>Swing</span>
          <span>AWT</span>
          <span>OOP</span>
        </div>
      </div>

      <div className="project-card">
        <div className="project-icon">
          <i className="fas fa-camera"></i>
        </div>
        <h3>Face & Eyesight Power Detection</h3>
        <p>
          Computer vision application using OpenCV that detects faces and
          analyzes eyesight metrics to estimate prescription power requirements.
        </p>
        <div className="project-techs">
          <span>Python</span>
          <span>OpenCV</span>
          <span>Computer Vision</span>
          <span>Machine Learning</span>
        </div>
      </div>
    </div>
  </section>
);

// Certificates Component - Separate from Courses
const Certificates = () => {
  const [activeModal, setActiveModal] = useState(null);
  const handleOpenModal = (imgPath) => setActiveModal(imgPath);
  const handleCloseModal = () => setActiveModal(null);

  const certificates = [
    {
      title: "Oracle Cloud Infrastructure 2024 Generative AI Professional",
      credentialId: "100728122OCI2024GAIOCP",
      badgePath: "/badge1.png",
      certPath: "/Oracle_cert.jpeg",
    },
    {
      title: "Full Stack Web Development Course",
      credentialId: "NT_20FSD249",
      certPath: "novitech.png",
    },
    {
      title: "Diploma in Programming Languages",
      credentialId: "10472001375166",
      certPath: "pgdca_mark.png",
    },
    {
      title: "Ethical Hacking Workshop (IIT Madras)",
      credentialId: "TB-CHESIITM-TWS24-L1-EH-031",
      certPath: "workshop.png",
    },
    {
      title: "NASSCOM Cybersecurity Analyst Certificate",
      credentialId: "",
      certPath: "Screenshot 2025-04-10 205003.png",
      isPdf: true,
      pdfPath: "nasscom_cert.pdf",
    },
    {
      title: "Python Basics By Accenture",
      credentialId: "",
      badgePath: "/python_cert.png",
    },
    {
      title: "SQL Basics By Accenture",
      credentialId: "",
      badgePath: "/sql_cert.png",
    },
    {
      title: "DSA By Accenture",
      credentialId: "",
      badgePath: "/dsa_cert.png",
    },
  ];

  return (
    <section className="section" id="certificates">
      <div className="section-header">
        <h2>Certifications</h2>
        <div className="underline"></div>
      </div>

      <div className="certificates-grid">
        {certificates.map((cert, index) => (
          <div className="certificate-card" key={index}>
            <div className="certificate-content">
              <h3>{cert.title}</h3>
              {cert.credentialId && (
                <p className="credential-id">ID: {cert.credentialId}</p>
              )}
              {cert.badgePath && (
                <img
                  src={cert.badgePath}
                  alt="Certificate Badge"
                  className="certificate-badge"
                />
              )}
            </div>
            {cert.certPath && (
              <div
                className="certificate-thumbnail"
                onClick={() =>
                  handleOpenModal(cert.isPdf ? cert.pdfPath : cert.certPath)
                }
              >
                <img src={cert.certPath} alt={cert.title} />
                <div className="view-overlay">
                  <i className="fas fa-search-plus"></i> View
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {activeModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container">
            <span className="modal-close" onClick={handleCloseModal}>
              &times;
            </span>
            {activeModal.endsWith(".pdf") ? (
              <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
                <iframe
                  src={activeModal}
                  title="Certificate PDF"
                  className="pdf-viewer"
                />
              </div>
            ) : (
              <img
                src={activeModal}
                alt="Certificate Full View"
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

// Contact Component with form
// Fix default marker icon issue with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_woo622b",
        "template_5ypx8rv",
        formData,
        "cOuorIoZhPG44_SyU"
      )
      .then(
        (result) => {
          console.log("Email successfully sent!", result.text);
          alert("Thank you for your message! I'll get back to you soon.");
          setFormData({ name: "", email: "", subject: "", message: "" });
        },
        (error) => {
          console.error("Email send error:", error.text);
          alert("Oops! Something went wrong. Please try again later.");
        }
      );
  };

  return (
    <section className="section" id="contact">
      <div className="section-header">
        <h2>Get In Touch</h2>
        <div className="underline"></div>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          {/* Contact Details */}
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <h3>Location</h3>
              <p>No:18A/37, Bharathiyar Street, Chennai - 600050</p>
            </div>
          </div>

          {/* Other Contact Items */}
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <div>
              <h3>Email</h3>
              <p>kalaimani2827@gmail.com</p>
            </div>
          </div>

          <div className="contact-item">
            <i className="fas fa-phone"></i>
            <div>
              <h3>Phone</h3>
              <p>+91-6379518003</p>
            </div>
          </div>

          <div className="contact-item">
            <i className="fas fa-user"></i>
            <div>
              <h3>Personal Details</h3>
              <p>Nationality: Indian</p>
              <p>Languages: English (Fluent), Tamil (Native)</p>
              <p>Date of Birth: 07/03/2005</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="social-links">
            <a
              href="https://www.linkedin.com/in/malar-kiruba-8847a0343/?trk=opento_nprofile_details"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="https://github.com/kiruba2827"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              <i className="fab fa-github"></i>
            </a>
            <a href="mailto:kalaimani2827@gmail.com" className="social-icon">
              <i className="fas fa-envelope"></i>
            </a>
          </div>

          {/* 🌍 Map Component */}
          <div
            className="map-container"
            style={{
              height: "300px",
              marginTop: "20px",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <MapContainer
              center={[13.09172, 80.179626]} // Precise location
              zoom={18}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[13.09172, 80.179626]}>
                <Popup>
                  35-18/A, Bharathiyar Street, Sathya Nagar, Padi, Chennai,
                  Tamil Nadu 600050
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        <div className="contact-form">
          <h3>Send Me a Message</h3>
          <form onSubmit={handleSubmit}>
            {/* Form Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send Message <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <p>
        &copy; {new Date().getFullYear()} K. Malar Kiruba. All Rights Reserved.
      </p>
      <p>Computer Science Student | Full-Stack Developer</p>
    </div>
  </footer>
);

function App() {
  const [activeSection, setActiveSection] = useState("home");

  return (
    <div className="App">
      <Navigation
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <Home />
      <About />
      <Experience />
      <Education />
      <Skills />
      <Projects />
      <Certificates />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;

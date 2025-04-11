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
const Home = () => (
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

        {/* Download Resume Button */}
        <div className="resume-download">
          <a
            href="/Kiruba_Resume.docx" // Make sure this file is placed in the public folder
            download
            className="download-button"
          >
            <i className="fas fa-download"></i> Download Resume
          </a>
        </div>
      </div>
    </div>
    <div className="scroll-down">
      <span>Scroll Down</span>
      <i className="fas fa-chevron-down"></i>
    </div>
  </section>
);

// About Component with visual enhancements
const About = () => (
  <section className="section" id="about">
    <div className="section-header">
      <h2>About Me</h2>
      <div className="underline"></div>
    </div>
    <div className="about-content">
      <div className="about-text">
        <p>
          I'm a dynamic Computer Science student with hands-on experience at
          C-DAC, where I've developed RESTful APIs, enhanced network monitoring
          systems, and implemented security measures following OWASP guidelines.
        </p>
        <p>
          My expertise spans full-stack web development, cloud infrastructure,
          and network security. I excel at optimizing system performance and
          integrating complex functionalities in diverse technical environments.
        </p>
        <p>
          I'm seeking opportunities to apply my technical expertise where I can
          continue to grow while making meaningful contributions to innovative
          projects.
        </p>
      </div>
      <div className="key-highlights">
        <div className="highlight-card">
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
  </section>
);

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
  }, []);

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

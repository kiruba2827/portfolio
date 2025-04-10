import React, { useState, useEffect, useMemo } from "react";
import "./App.css"; // We'll keep your existing CSS file and add new styles
import emailjs from "emailjs-com";

// Navigation Component
const Navigation = ({ activeSection, setActiveSection }) => {
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
  ); // Empty dependency array means this is only created once

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Find which section is currently visible
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

  // ✅ Dark mode init on load
  useEffect(() => {
    const body = document.body;
    const storedTheme = localStorage.getItem("dark-mode");
    if (storedTheme === "true") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }, []);

  // ✅ Theme toggle function
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

  const scrollToSection = (id) => {
    setActiveSection(id);
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed-nav">
      <div className="logo">
        MK
        {/* ✅ Dark Mode Toggle */}
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
              className={activeSection === section.id ? "active" : ""}
              onClick={() => scrollToSection(section.id)}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="mobile-nav-toggle">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
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
        <h1>K. Malar Kiruba</h1>
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
const Skills = () => (
  <section className="section" id="skills">
    <div className="section-header">
      <h2>Skills & Expertise</h2>
      <div className="underline"></div>
    </div>

    <div className="skills-container">
      <div className="skill-category">
        <h3>
          <i className="fas fa-laptop-code"></i> Programming Languages
        </h3>
        <div className="skill-grid">
          <div className="skill-item">
            <div className="skill-name">Python</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "90%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">JavaScript</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "85%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">Java</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "80%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">C/C++</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "75%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">HTML/CSS</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "90%" }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="skill-category">
        <h3>
          <i className="fas fa-server"></i> Web Development & Databases
        </h3>
        <div className="skill-grid">
          <div className="skill-item">
            <div className="skill-name">MERN Stack</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "85%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">Django</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "80%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">RESTful APIs</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "90%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">MySQL/PostgreSQL</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "85%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">MongoDB</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "80%" }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="skill-category">
        <h3>
          <i className="fas fa-cloud"></i> Cloud & DevOps
        </h3>
        <div className="skill-grid">
          <div className="skill-item">
            <div className="skill-name">Oracle Cloud</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "90%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">OpenStack</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "85%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">Hadoop Ecosystem</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "70%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">Linux (Ubuntu/RedHat)</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "80%" }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="skill-category">
        <h3>
          <i className="fas fa-shield-alt"></i> Security & Networks
        </h3>
        <div className="skill-grid">
          <div className="skill-item">
            <div className="skill-name">OWASP Top 10</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "85%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">Packet Analysis</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "80%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">Ethical Hacking</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "75%" }}></div>
            </div>
          </div>
          <div className="skill-item">
            <div className="skill-name">Network Monitoring</div>
            <div className="skill-bar">
              <div className="skill-level" style={{ width: "85%" }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="skill-category">
        <h3>
          <i className="fas fa-comments"></i> Soft Skills
        </h3>
        <div className="soft-skills">
          <span className="soft-skill-badge">Problem Solving</span>
          <span className="soft-skill-badge">Communication</span>
          <span className="soft-skill-badge">Teamwork</span>
          <span className="soft-skill-badge">Adaptability</span>
          <span className="soft-skill-badge">Critical Thinking</span>
          <span className="soft-skill-badge">Diplomacy</span>
          <span className="soft-skill-badge">Continuous Learning</span>
        </div>
      </div>
    </div>
  </section>
);

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
              <h3>C-DAC, Chennai, India</h3>
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
        "service_woo622b", // 🔁 Replace with your actual Service ID
        "template_5ypx8rv", // 🔁 Replace with your actual Template ID
        formData,
        "cOuorIoZhPG44_SyU" // 🔁 Replace with your Public Key from EmailJS
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
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <h3>Location</h3>
              <p>No:18A/37, Bharathiyar Street, Chennai - 600050</p>
            </div>
          </div>

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
        </div>

        <div className="contact-form">
          <h3>Send Me a Message</h3>
          <form onSubmit={handleSubmit}>
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

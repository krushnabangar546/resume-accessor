import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/database.js';
import Job from '../models/Job.js';
import Resume from '../models/Resume.js';

const sampleJobs = [
  {
    title: 'Senior Backend Developer',
    company: 'TechCorp Solutions',
    description: `We are looking for a Senior Backend Developer to join our engineering team.

Requirements:
- 4+ years of experience with Node.js and Express.js
- Strong knowledge of MongoDB and database design
- Experience building RESTful APIs
- Proficiency with Git and code review processes
- Understanding of microservices architecture

Preferred:
- TypeScript experience
- Redis caching knowledge
- Docker and container orchestration
- AWS cloud services (EC2, S3, Lambda)
- CI/CD pipeline experience

Responsibilities:
- Design and implement scalable backend services
- Lead code reviews and mentor junior developers
- Optimize database queries and application performance
- Collaborate with frontend teams on API design
- Participate in system architecture discussions`,
    requirements: {
      requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Git'],
      preferredSkills: ['TypeScript', 'Redis', 'Docker', 'AWS', 'CI/CD'],
      experienceRequired: '4+ years of backend development experience',
      educationRequirements: 'BS/MS in Computer Science or equivalent experience',
      responsibilities: [
        'Design and implement scalable backend services',
        'Lead code reviews and mentor junior developers',
        'Optimize database queries and application performance',
        'Collaborate with frontend teams on API design'
      ]
    }
  },
  {
    title: 'Full Stack Developer',
    company: 'StartupHub Inc',
    description: `Join our fast-growing startup as a Full Stack Developer.

Requirements:
- 3+ years of experience with React and modern JavaScript
- Experience with Node.js backend development
- Proficiency in HTML5, CSS3, and responsive design
- Knowledge of RESTful API design and integration
- Familiarity with SQL or NoSQL databases

Preferred:
- TypeScript proficiency
- State management (Redux, Zustand)
- MongoDB experience
- AWS or GCP deployment experience
- Testing frameworks (Jest, Cypress)

Responsibilities:
- Build user-facing features using React
- Develop and maintain backend APIs
- Implement responsive, cross-browser compatible UIs
- Write unit and integration tests
- Participate in agile development processes`,
    requirements: {
      requiredSkills: ['React', 'Node.js', 'JavaScript', 'HTML/CSS', 'REST APIs'],
      preferredSkills: ['TypeScript', 'Redux', 'MongoDB', 'AWS', 'Jest', 'Cypress'],
      experienceRequired: '3+ years of full stack development experience',
      educationRequirements: 'BS in Computer Science or related field',
      responsibilities: [
        'Build user-facing features using React',
        'Develop and maintain backend APIs',
        'Implement responsive cross-browser compatible UIs',
        'Write unit and integration tests'
      ]
    }
  },
  {
    title: 'Python Data Engineer',
    company: 'DataFlow Analytics',
    description: `We need a Data Engineer to build and maintain our data infrastructure.

Requirements:
- 2+ years of experience with Python for data engineering
- Proficiency with SQL and database management
- Experience designing and implementing ETL pipelines
- Knowledge of data modeling and warehousing concepts
- Pandas and NumPy proficiency

Preferred:
- Apache Spark or PySpark experience
- AWS data services (Glue, Redshift, S3)
- Docker containerization
- Airflow or similar orchestration tools
- Basic machine learning knowledge

Responsibilities:
- Design and build data pipelines for batch and streaming data
- Maintain and optimize data warehouse schemas
- Collaborate with data scientists on data access patterns
- Monitor pipeline health and troubleshoot failures
- Document data models and pipeline architectures`,
    requirements: {
      requiredSkills: ['Python', 'SQL', 'ETL', 'Pandas', 'Data Pipelines'],
      preferredSkills: ['Apache Spark', 'AWS', 'Docker', 'Airflow', 'Machine Learning'],
      experienceRequired: '2+ years of data engineering experience',
      educationRequirements: 'BS in Computer Science, Engineering, or Mathematics',
      responsibilities: [
        'Design and build data pipelines for batch and streaming data',
        'Maintain and optimize data warehouse schemas',
        'Collaborate with data scientists on data access patterns',
        'Monitor pipeline health and troubleshoot failures'
      ]
    }
  }
];

const sampleResumes = [
  {
    filename: 'alice_johnson_resume.pdf',
    rawText: `Alice Johnson
Email: alice.johnson@email.com | Phone: +1-555-0101
GitHub: github.com/alicejohnson | LinkedIn: linkedin.com/in/alicejohnson

SUMMARY
Full Stack Developer with 4 years of experience building scalable web applications using React and Node.js. Passionate about clean code and user experience.

SKILLS
Technical: React, Node.js, TypeScript, JavaScript (ES6+), MongoDB, Express.js, Redux, HTML5, CSS3, Tailwind CSS, Git, Docker, AWS S3, Jest, REST APIs, GraphQL
Soft Skills: Problem-solving, Team collaboration, Agile/Scrum

EXPERIENCE
Senior Full Stack Developer — TechVentures Ltd (Jan 2022 – Present)
- Led development of a SaaS platform serving 10,000+ users using React and Node.js
- Reduced API response times by 40% through MongoDB indexing and query optimization
- Implemented CI/CD pipeline with GitHub Actions and Docker

Full Stack Developer — WebCraft Agency (Jun 2020 – Dec 2021)
- Built 15+ client web applications using React, Node.js, and MongoDB
- Integrated third-party APIs (Stripe, Twilio, SendGrid)
- Mentored 2 junior developers

EDUCATION
Bachelor of Science in Computer Science
State University of Technology, 2020

CERTIFICATIONS
AWS Certified Developer - Associate (2023)
MongoDB Professional Developer (2022)

PROJECTS
E-Commerce Platform (React, Node.js, MongoDB, Stripe)
- Full-featured online store with inventory management, payment processing, and admin dashboard serving 500+ daily active users

Real-time Task Manager (React, Socket.io, Node.js, Redis)
- Collaborative task management app with real-time updates, used by 3 teams internally`,
    candidate: {
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1-555-0101',
      skills: ['React', 'Node.js', 'TypeScript', 'JavaScript', 'MongoDB', 'Express.js', 'Redux', 'HTML5', 'CSS3', 'Tailwind CSS', 'Git', 'Docker', 'AWS S3', 'Jest', 'REST APIs', 'GraphQL'],
      experience: [
        {
          title: 'Senior Full Stack Developer',
          company: 'TechVentures Ltd',
          duration: 'Jan 2022 – Present',
          description: 'Led development of a SaaS platform serving 10,000+ users using React and Node.js. Reduced API response times by 40% through MongoDB indexing.'
        },
        {
          title: 'Full Stack Developer',
          company: 'WebCraft Agency',
          duration: 'Jun 2020 – Dec 2021',
          description: 'Built 15+ client web applications using React, Node.js, and MongoDB. Integrated third-party APIs.'
        }
      ],
      education: [{ degree: 'Bachelor of Science in Computer Science', institution: 'State University of Technology', year: '2020' }],
      certifications: ['AWS Certified Developer - Associate (2023)', 'MongoDB Professional Developer (2022)'],
      projects: [
        { name: 'E-Commerce Platform', description: 'Full-featured online store with inventory management and payment processing', technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'] },
        { name: 'Real-time Task Manager', description: 'Collaborative task management app with real-time updates', technologies: ['React', 'Socket.io', 'Node.js', 'Redis'] }
      ]
    }
  },
  {
    filename: 'bob_smith_resume.pdf',
    rawText: `Bob Smith
Email: bob.smith@email.com | Phone: +1-555-0202

PROFESSIONAL SUMMARY
Backend Engineer with 6 years specializing in Python, Django, and distributed systems. Expert at building high-throughput APIs and data-intensive applications.

TECHNICAL SKILLS
Languages: Python, SQL, Bash, Go (learning)
Frameworks: Django, FastAPI, Flask, Celery
Databases: PostgreSQL, MySQL, Redis, Elasticsearch
DevOps: Docker, Kubernetes, AWS (EC2, RDS, S3, Lambda), Terraform, GitHub Actions
Tools: Git, Jira, Postman, Grafana

WORK EXPERIENCE
Senior Backend Engineer — GlobalTech Corp (Mar 2021 – Present)
- Architected microservices system handling 5M+ daily requests
- Migrated monolithic Django app to containerized microservices, reducing deploy time by 70%
- Built real-time data streaming pipeline using Kafka and Python

Backend Developer — DataSystems Inc (Aug 2018 – Feb 2021)
- Developed REST APIs for financial data processing platform
- Optimized PostgreSQL queries reducing average query time from 3s to 200ms
- Implemented automated testing suite achieving 90% code coverage

EDUCATION
Master of Science in Computer Science — Tech University (2018)
Bachelor of Engineering in Software Engineering — State College (2016)

PROJECTS
Distributed Task Queue System (Python, Redis, Celery, Docker)
- Built a distributed job processing system handling 100K+ tasks per hour with automatic retry and monitoring

Microservices Architecture Demo (Python, Docker, Kubernetes, PostgreSQL)
- Designed and implemented a reference microservices architecture with service discovery and load balancing`,
    candidate: {
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      phone: '+1-555-0202',
      skills: ['Python', 'SQL', 'Bash', 'Django', 'FastAPI', 'Flask', 'Celery', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Docker', 'Kubernetes', 'AWS', 'Terraform', 'Git', 'REST APIs', 'Kafka'],
      experience: [
        {
          title: 'Senior Backend Engineer',
          company: 'GlobalTech Corp',
          duration: 'Mar 2021 – Present',
          description: 'Architected microservices system handling 5M+ daily requests. Migrated monolithic Django app to containerized microservices.'
        },
        {
          title: 'Backend Developer',
          company: 'DataSystems Inc',
          duration: 'Aug 2018 – Feb 2021',
          description: 'Developed REST APIs for financial data processing. Optimized PostgreSQL queries and implemented automated testing.'
        }
      ],
      education: [
        { degree: 'Master of Science in Computer Science', institution: 'Tech University', year: '2018' },
        { degree: 'Bachelor of Engineering in Software Engineering', institution: 'State College', year: '2016' }
      ],
      certifications: [],
      projects: [
        { name: 'Distributed Task Queue System', description: 'Distributed job processing system handling 100K+ tasks per hour', technologies: ['Python', 'Redis', 'Celery', 'Docker'] },
        { name: 'Microservices Architecture Demo', description: 'Reference microservices architecture with service discovery', technologies: ['Python', 'Docker', 'Kubernetes', 'PostgreSQL'] }
      ]
    }
  },
  {
    filename: 'carol_white_resume.pdf',
    rawText: `Carol White
Email: carol.white@email.com | Phone: +1-555-0303
Portfolio: carolwhite.dev

DATA ENGINEER
3 years building robust data pipelines and analytics infrastructure

SKILLS
Programming: Python, SQL, Scala (basic), Bash
Data Tools: Apache Spark, PySpark, Pandas, NumPy, dbt, Apache Airflow
Databases: PostgreSQL, MySQL, MongoDB, Amazon Redshift, Snowflake
Cloud: AWS (S3, Glue, EMR, Redshift, Lambda), GCP (BigQuery)
Other: Docker, Git, Jupyter, Tableau, Power BI

EXPERIENCE
Data Engineer — Analytics Co (Jul 2023 – Present)
- Built automated ETL pipelines processing 500GB+ daily using Apache Spark and AWS Glue
- Designed star-schema data warehouse in Redshift for business intelligence reporting
- Reduced data processing time by 60% through Spark optimization techniques

Junior Data Engineer — InsightLabs (Sep 2021 – Jun 2023)
- Developed Python ETL scripts for 20+ data sources
- Created data quality monitoring using dbt tests
- Built Airflow DAGs for pipeline orchestration

EDUCATION
Bachelor of Science in Engineering (Data Science Track)
Engineering Institute, 2021

CERTIFICATIONS
AWS Certified Data Analytics - Specialty (2024)
Google Professional Data Engineer (2023)

PROJECTS
Real-time Analytics Dashboard (Python, Kafka, Spark Streaming, MongoDB)
- Built end-to-end streaming pipeline from IoT devices to live business dashboards

Customer Segmentation Pipeline (Python, PySpark, Pandas, Redshift)
- Automated ML feature engineering pipeline processing 10M customer records daily`,
    candidate: {
      name: 'Carol White',
      email: 'carol.white@email.com',
      phone: '+1-555-0303',
      skills: ['Python', 'SQL', 'Scala', 'Apache Spark', 'PySpark', 'Pandas', 'NumPy', 'dbt', 'Apache Airflow', 'PostgreSQL', 'MySQL', 'MongoDB', 'Amazon Redshift', 'Snowflake', 'AWS', 'GCP', 'Docker', 'Git', 'ETL', 'Kafka', 'BigQuery'],
      experience: [
        {
          title: 'Data Engineer',
          company: 'Analytics Co',
          duration: 'Jul 2023 – Present',
          description: 'Built automated ETL pipelines processing 500GB+ daily using Apache Spark and AWS Glue. Designed data warehouse for BI reporting.'
        },
        {
          title: 'Junior Data Engineer',
          company: 'InsightLabs',
          duration: 'Sep 2021 – Jun 2023',
          description: 'Developed Python ETL scripts for 20+ data sources. Created data quality monitoring and Airflow DAGs.'
        }
      ],
      education: [{ degree: 'Bachelor of Science in Engineering (Data Science Track)', institution: 'Engineering Institute', year: '2021' }],
      certifications: ['AWS Certified Data Analytics - Specialty (2024)', 'Google Professional Data Engineer (2023)'],
      projects: [
        { name: 'Real-time Analytics Dashboard', description: 'End-to-end streaming pipeline from IoT devices to live business dashboards', technologies: ['Python', 'Kafka', 'Spark Streaming', 'MongoDB'] },
        { name: 'Customer Segmentation Pipeline', description: 'Automated ML feature engineering pipeline processing 10M customer records daily', technologies: ['Python', 'PySpark', 'Pandas', 'Redshift'] }
      ]
    }
  }
];

const seed = async () => {
  await connectDB();

  await Job.deleteMany({});
  await Resume.deleteMany({});

  await Job.insertMany(sampleJobs);
  console.log(`Seeded ${sampleJobs.length} jobs`);

  await Resume.insertMany(sampleResumes);
  console.log(`Seeded ${sampleResumes.length} resumes`);

  console.log('Seed complete');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

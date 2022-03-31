import "../lib/headings.css"
import "./Skills.css"

import PageContainer from "../components/PageContainer"
import BlogArticle from "../components/BlogArticle"

export default function Skills() {
  return (
    <PageContainer>
      <BlogArticle title="Education">
        <p>
          Studied at Computer Science (Bsc) at The University of Melbourne from 2018-2021, graduating with
          a gpa of 5.8, equivalent to a Weighted Average Mark (WAM) of 77.25.
        </p>
        <p>
          In addition to the core Computer Science subject, I also took a number of biology subjects (Chemistry,
          Biochemistry, Genetics, Human Physiology and Anatomy), as I have an interest in simulating biological
          systems in a virtual environment, and believe that combining computing with biology is a fascinating
          field of study.
        </p>
      </BlogArticle>
      <BlogArticle title="Work Experience">
        <h3>Pharmacy Assistant</h3>
        <h4>
          <span className="workxp-span">Star Pharmacy</span>
          <span className="workxp-span">Melbourne VIC</span>
          <span className="workxp-span">Aug 2015 - Present</span>
        </h4>
        <p>
          I started working at Star Pharmacy before I began my university studies and continued to work there
          throughout my degree, in a part-time capacity. Though initially I felt uncomfortable in a customer-
          facing position, this role greatly helped me develope my people and communication skills, and over
          the years I found it to be a refreshing change from my studies, which was mostly at a computer.
        </p>
        <p>
          I worked both in a Pharmacy Assistant role, and a Medication Delivery role, and had the opportunity
          to work in multiple stores (Kew and Middle Park). I believe that my consistent and professional
          service played a significant role in the flourishing and expansion the delivery side of the business.
          There were quite a few instances of satisfied customers who recommended the service to their
          neighbors, whom I consequently delivered to.
        </p>
      </BlogArticle>
      <BlogArticle title="Notable Achievements">
        <ul className="skills-list">
          <li>
            <p>
              Selected as one of the top 3 teams of the Computer Science IT Project capstone subject, and had the
              honour of presenting my work at the 2021 University of Melbourne CIS conference.
            </p>
          </li>
          <li>
            <p>
              Final year Software Modeling and Design project, where we designed a card game using object
              oriented principles and design patterns, scored 100% and was selected as a reference for future
              year students.
            </p>
          </li>
        </ul>
      </BlogArticle>
      <BlogArticle title="Skills">
        <h4>Languages</h4>
        <ul className="skills-table">
          <li>C</li>
          <li>C++</li>
          <li>C#</li>
          <li>Python</li>
          <li>Java</li>
          <li>JavaScript</li>
          <li>TypeScript</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>HLSL</li>
        </ul>
        <h4>Frameworks, Libraries and other</h4>
        <ul className="skills-table">
          <li>ReactJs</li>
          <li>NextJs</li>
          <li>Material UI</li>
          <li>Node.Js</li>
          <li>REST API</li>
          <li>Github</li>
          <li>Github Actions</li>
          <li>Git</li>
        </ul>
        <h4>Project</h4>
        <ul className="skills-table">
          <li>Agile Development</li>
          <li>Jira</li>
          <li>Trello</li>
          <li>Confluence</li>
        </ul>
        <h4>Software Concepts</h4>
        <ul className="skills-table">
          <li>Object Oriented Programming</li>
          <li>Algorithms</li>
        </ul>
      </BlogArticle>
    </PageContainer>
  )
}
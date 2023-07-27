import "./Examples.css"

import cataLogCreateAccImg from "../assets/images/catalog-create-acc.png"
import cataLogHomeImg from "../assets/images/catalog-home.png"
import cataLogSearchImg from "../assets/images/catalog-search.png"
import cataLogManualContactImg from "../assets/images/catalog-manual-contact.png"
import cataLogMergeImg from "../assets/images/catalog-merge.png"
import cataLogCreateOrgImg from "../assets/images/catalog-create-org.png"
import cataLogMobileHomeImg from "../assets/images/catalog-mobile-home.png"
import cataLogMobileContactImg from "../assets/images/catalog-mobile-contact.png"
import cataLogMobileCreateContactImg from "../assets/images/catalog-mobile-create-contact.png"
import vercelLogoImg from "../assets/images/vercel-logo.jpg"

import CustomLink from "../components/CustomLink"
import LinkBlock from "../components/LinkBlock"
import PageContainer from "../components/PageContainer"
import BlogArticle from "../components/BlogArticle"

export default function Examples() {
  return (
    <PageContainer
      title="Examples of My Work"
      contentStyle={{
        desktop: { marginTop: "42px" },
        mobile: {}
      }}
      contentBlockStyle={{
        desktop: { marginBottom: "60px" },
        mobile: { padding: "12px 30px 50px" }
      }}
      contentTestId="examplesPage"
    >
      <BlogArticle title="CataLog">
        <LinkBlock
          links={[
            <CustomLink key="githubLink" href="https://github.com/bawses/it-project-crm" text="Github" />,
            <CustomLink key="crmLink" href="https://it-project-crm.vercel.app/welcome" text="Deployment" />,
          ]}
        />
        <p className="intro-p">
          CataLog is an online CRM (Customer Relationship Management software) created for the capstone
          comp sci subject. To create this product, I had to work in a team of 5, follow agile development
          methodology, and negotiate requirements with a client. Highlights include:
        </p>
        <ul className="examples-list">
          <li>
            <div>Creating and customizing user profiles</div>
            <img src={cataLogCreateAccImg} alt="Creating an account" width="80%" height="80%" />
          </li>
          <li>
            <div>Categorizing and filtering added contacts</div>
            <img src={cataLogHomeImg} alt="Home page" width="80%" height="80%" />
          </li>
          <li>
            <div>Searching for and adding contacts on the CataLog network</div>
            <img src={cataLogSearchImg} alt="Search page" width="80%" height="80%" />
          </li>
          <li>
            <div>Creating manual contact entries for contacts not on the CataLog network</div>
            <img src={cataLogManualContactImg} alt="Create manual contact page" width="80%" height="80%" />
          </li>
          <li>
            <div>Merging newly-added CataLog profiles with existing manual profiles</div>
            <img src={cataLogMergeImg} alt="Create manual contact page" width="80%" height="80%" />
          </li>
          <li>
            <div>Creating and interacting with organizations</div>
            <img src={cataLogCreateOrgImg} alt="Create organization page" width="80%" height="80%" />
          </li>
          <li>
            <div>Fully functional on both desktop and mobile devices</div>
            <div className="examples-mobile-images">
              <img src={cataLogMobileHomeImg} alt="Mobile home page" width="25%" height="25%" />
              <img src={cataLogMobileContactImg} alt="Mobile contact page" width="25%" height="25%" />
              <img src={cataLogMobileCreateContactImg} alt="Mobile create contact page" width="25%" height="25%" />
            </div>
          </li>
          <li>
            <div>Deployed in a serverless environment on Vercel Cloud</div>
            <img src={vercelLogoImg} alt="Vercel cloud" width="80%" height="80%" />
          </li>
        </ul>
      </BlogArticle>
    </PageContainer>
  )
}
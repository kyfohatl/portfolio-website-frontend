import PageContainer from "../components/PageContainer"
import FeatureDisplayCard from "../components/FeatureDisplayCard"
import Hero from "../components/Hero"
import { useCallback, useMemo, useRef, useState } from "react"
import Deleting, { DeletingStyleOverrides } from "../components/animation/Deleting"
import Saving, { SavingStyleOverrides } from "../components/animation/Saving"
import Button from "../components/Button"
import Loading from "../components/Loading"
import { CodeBlock, dracula } from "react-code-blocks"

// Images
import CreateBlogImg from "../assets/images/homePageDemos/create_blog.png"
import SummaryImg from "../assets/images/homePageDemos/summary_removedBg_focused.png"
import SummaryCardImg from "../assets/images/homePageDemos/summary_card.png"
import EditBlogImg from "../assets/images/homePageDemos/edit_blog.png"
import ViewBlogsImg from "../assets/images/homePageDemos/view_blogs_removedBg.png"
import SignUpImg from "../assets/images/homePageDemos/sign_up.png"
import ThirdPartyLoginImg from "../assets/images/homePageDemos/google_facebook_removedBg.png"
import FigmaDesignImg from "../assets/images/homePageDemos/figma_designs.png"
import FrontendTestImg from "../assets/images/homePageDemos/frontendTesting.png"
import GithubActionsImg from "../assets/images/homePageDemos/githubActions.png"
import UpcomingCodeImg from "../assets/images/homePageDemos/upcoming_features.jpg"

// Mobile images
import CreateBlogMobileImg from "../assets/images/homePageDemos/mobile/createBlog.png"
import SummaryMobileImg from "../assets/images/homePageDemos/mobile/summariseBlog.png"
import EditBlogMobileImg from "../assets/images/homePageDemos/mobile/editBlog.png"
import ViewBlogsMobileImg from "../assets/images/homePageDemos/mobile/viewBlogs.png"
import SignUpMobileImg from "../assets/images/homePageDemos/mobile/signUp.png"
import ThirdPartyLoginMobileImg from "../assets/images/homePageDemos/mobile/signIn.png"
import FigmaDesignMobileImg from "../assets/images/homePageDemos/mobile/figma.png"

// Logos
import ReactLogo from "../assets/images/homePageDemos/techstackLogos/react_logo.png"
import TypeScriptLogo from "../assets/images/homePageDemos/techstackLogos/typescript_logo.png"
import { ReactComponent as HtmlLogo } from "../assets/images/homePageDemos/techstackLogos/html_logo.svg"
import CssLogo from "../assets/images/homePageDemos/techstackLogos/css_logo.png"
import NodeJsLogo from "../assets/images/homePageDemos/techstackLogos/node_js_logo.png"
import ExpressLogo from "../assets/images/homePageDemos/techstackLogos/express_logo.png"
import JwtLogo from "../assets/images/homePageDemos/techstackLogos/jwt_logo.png"
import PostgresLogo from "../assets/images/homePageDemos/techstackLogos/postgres_logo.png"
import HerokuLogo from "../assets/images/homePageDemos/techstackLogos/heroku_logo.png"
import JestLogo from "../assets/images/homePageDemos/techstackLogos/jest_logo.png"
import ReactTestingLibLogo from "../assets/images/homePageDemos/techstackLogos/reactTestingLibrary_logo.png"
import CypressLogo from "../assets/images/homePageDemos/techstackLogos/cypress_logo.png"
import GitLogo from "../assets/images/homePageDemos/techstackLogos/git_logo.png"
import GitHubLogo from "../assets/images/homePageDemos/techstackLogos/github_logo.png"
import GithubActionsLogo from "../assets/images/homePageDemos/techstackLogos/githubActions_logo.png"
import FigmaLogo from "../assets/images/homePageDemos/techstackLogos/figma_logo.png"
import QuestionMark from "../components/animation/QuestionMark"
import LogoContainer from "../components/home/LogoContainer"

const MOB_IMG_WIDTH = "90%"

export default function Home() {
  // For scrolling to the first feature display card upon clicking the "Explore" button
  const firstFeatureRef = useRef<HTMLDivElement>(null)
  const onExploreClick = useCallback(() => {
    if (!firstFeatureRef.current) return

    if (window.Cypress) {
      // Unfortunately smooth scrolling behavior breaks Cypress e2e tests. So as much as I hate doing so, I have to
      // put some testing code in production code since there is no other easier way to get this to work that I have
      // found
      firstFeatureRef.current.scrollIntoView()
    } else {
      firstFeatureRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  // Restarts the bin animation 1 second after its completion
  const [deletingAnimState, setDeletingAnimState] = useState<DeletingStyleOverrides>()
  const onDeletingEnd = useCallback(() => {
    setDeletingAnimState({ rubbishStyles: { animationName: "none" }, lidStyles: { animationName: "none" } })
    setTimeout(() => {
      setDeletingAnimState({ rubbishStyles: { animationName: "" }, lidStyles: { animationName: "" } })
    }, 1000)
  }, [])

  // Restarts the checkmark animation 1 second after its completion
  const [savingAnimState, setSavingAnimState] = useState<SavingStyleOverrides>()
  const onSavingEnd = useCallback(() => {
    setSavingAnimState({ tickStyles: { animationName: "none" }, circleStyles: { animationName: "none" } })
    setTimeout(() => {
      setSavingAnimState({ tickStyles: { animationName: "" }, circleStyles: { animationName: "" } })
    }, 1000)
  }, [])

  const animations = useMemo(() => {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        <Button
          text="Deleting"
          type={{ type: "submit" }}
          buttonState={{
            state: "animated",
            animation: <Deleting onAnimationEnd={onDeletingEnd} overrides={deletingAnimState} />,
            text: "Deleting"
          }}
          width="120px"
          height="46px"
        />
        <Button
          text="Saving"
          type={{ type: "submit" }}
          buttonState={{
            state: "animated",
            animation: <Saving onAnimationEnd={onSavingEnd} overrides={savingAnimState} />,
            text: "Saving"
          }}
          width="120px"
          height="46px"
        />
        <Button
          text="none"
          type={{ type: "submit" }}
          buttonState={{ state: "loading" }}
          width="120px"
          height="46px"
        />
        <Button
          type={{ type: "submit" }}
          width="38px"
          height="38px"
          padding="0px"
          borderRadius="50px"
          backgroundColor="transparent"
          disabled
          icon={<QuestionMark
            width="38px"
            height="38px"
            overrides={{
              circle: { animationIterationCount: "infinite" },
              marker: { animationIterationCount: "infinite" },
              dot: { animationIterationCount: "infinite" }
            }}
          />}
        />
        <Loading overrideStyles={{ width: "120px", height: "120px" }} />
      </div>
    )
  }, [deletingAnimState, onDeletingEnd, onSavingEnd, savingAnimState])

  return (
    <PageContainer
      title=""
      contentBlockStyle={{ unified: { maxWidth: "100vw", display: "flex", flexDirection: "column" } }}
      contentTestId="homePage"
    >
      <Hero onExploreClick={onExploreClick} />
      <FeatureDisplayCard
        title="Create Your Own Blogs"
        notes={[
          "Write static blogs using the editors, and customize them to your heart's content using the power of HTML and CSS",
          "Live rendering of blog content using an iframe, so you can check your work",
          "VSCode-style editor with line numbering, custom built from scratch without the use of any frameworks. Basic syntax highlighting is planned for a future version",
          "Sign in required to create and edit blogs"
        ]}
        visuals={{
          desktop: { images: [{ imgLink: CreateBlogImg, width: "594px", height: "526px" }] },
          mobile: { images: [{ imgLink: CreateBlogMobileImg, width: MOB_IMG_WIDTH }] }
        }}
        ref={firstFeatureRef}
      />
      <FeatureDisplayCard
        title="Summarize Your Blogs"
        notes={[
          <div>Use the popular <a href="https://ogp.me/">Open Graph (OG)</a> protocol to write a summary of your blog</div>,
          "Your blog summary is then displayed on the main blogs page, where it can entice viewers to click on your blog and read it",
          "The OG protocol implementation has the added benefit of being automatically compatible with many social media platforms. When sharing your blog on sites such as Facebook and LinkedIn, your summary will be displayed.",
          "Use the “keywords” meta tag to add tags to your blog, which will be displayed on the summary card"
        ]}
        visuals={{
          desktop: {
            images: [
              { imgLink: SummaryImg, width: "593px", height: "492px" },
              { imgLink: SummaryCardImg, width: "593px", height: "119px" }
            ]
          },
          mobile: {
            custom: <>
              <CodeBlock
                language="html"
                showLineNumbers={true}
                text={'<meta property="og:title"/>\n<meta property="og:description"/>\n<meta property="og:image"/>\n<meta name="keywords"/>'}
                theme={dracula}
                customStyle={{
                  borderRadius: "10px",
                  fontWeight: "600",
                  boxShadow: "0px 0px 4px 3px #bababa",
                  width: "90%",
                  margin: "0 auto 10px auto"
                }}
              />
              <img src={SummaryMobileImg} alt="summary card" width={MOB_IMG_WIDTH} style={{ margin: "0 auto" }} />
            </>
          }
        }}
        theme="dark"
      />
      <FeatureDisplayCard
        title="Edit and Delete Blogs"
        notes={[
          "Edit or delete any of the blogs that you created at any time by clicking on the “Edit” and “Delete” buttons",
          "Clicking “Edit” will open the blog's HTML and CSS in the website's blog editor tool"
        ]}
        visuals={{
          desktop: { images: [{ imgLink: EditBlogImg, width: "593px", height: "691px" }] },
          mobile: { images: [{ imgLink: EditBlogMobileImg, width: MOB_IMG_WIDTH }] }
        }}
      />
      <FeatureDisplayCard
        title="Read Blogs"
        notes={[
          "View the summaries of your own blogs, as well as the works of other creators on the main blogs page",
          "Summaries are neatly contained and separated by animated blog cards",
          "Click on any of them to view the full blog",
          "Additional blogs are loaded automatically as you scroll towards the bottom of the page",
          "Upcoming features: Search and sort"
        ]}
        visuals={{
          desktop: { images: [{ imgLink: ViewBlogsImg, width: "593px", height: "690px" }] },
          mobile: { images: [{ imgLink: ViewBlogsMobileImg, width: MOB_IMG_WIDTH }] }
        }}
        theme="dark"
      />
      <FeatureDisplayCard
        title="Login"
        notes={[
          <div>Custom authentication system built using the <a href="https://jwt.io/">Json Web Token (JWT)</a> and <a href="https://www.npmjs.com/package/bcrypt">BCrypt libraries</a></div>,
          "Uses Access and Refresh tokens to verify the authenticity of communications between the frontend and backend",
          "Uses HTTP-only cookies to store tokens safely (instead of browser local storage), preventing an XSS attacker from stealing them",
          "Automatic extension of sessions using refresh tokens"
        ]}
        visuals={{
          desktop: { images: [{ imgLink: SignUpImg, width: "480px", height: "491px" }] },
          mobile: { images: [{ imgLink: SignUpMobileImg, width: MOB_IMG_WIDTH }] }
        }}
      />
      <FeatureDisplayCard
        title="Google and Facebook Login"
        notes={[
          <div>Uses the <a href="https://openid.net/connect/">OpenID Connect</a> protocol to securely verify a user with a third party authenticator (Google and Facebook)</div>,
          "After the first third party sign in, an account is created for the user on the backend automatically. Subsequent third party logins will invoke the user account",
          "Only requests an id_token, and not an OAuth2.0 access code. This ensures that only the bare minimum required information is given to this website's system (mainly email and user id)"
        ]}
        visuals={{
          desktop: { images: [{ imgLink: ThirdPartyLoginImg, width: "480px", height: "504px" }] },
          mobile: { images: [{ imgLink: ThirdPartyLoginMobileImg, width: MOB_IMG_WIDTH }] }
        }}
        theme="dark"
      />
      <FeatureDisplayCard
        title="Animations &amp; Feedback"
        notes={[
          "A variety of CSS and SVG animations all custom built from scratch, to enhance the experience of this site and give visual feedback to users",
          "Even more animations are in development"
        ]}
        visuals={{
          desktop: {
            custom: animations
          },
          mobile: {
            custom: animations
          }
        }}
      />
      <FeatureDisplayCard
        title="Design"
        notes={[
          <div>All pages were first designed in <a href="https://www.figma.com/">Figma</a> and then built from the design</div>,
          "Building pages from designs enforced good consistency of theme and colors throughout the website"
        ]}
        visuals={{
          desktop: { images: [{ imgLink: FigmaDesignImg, width: "593px", height: "439px" }] },
          mobile: { images: [{ imgLink: FigmaDesignMobileImg, width: MOB_IMG_WIDTH }] }
        }}
        theme="dark"
      />
      <FeatureDisplayCard
        title="Integration &amp; Unit Testing"
        notes={[
          "Comprehensive coverage of both the backend and frontend with unit and integration testing",
          <div>The backend is tested using the <a href="https://jestjs.io/">Jest</a> testing framework</div>,
          <div>Frontend testing is done using the Jest-based <a href="https://testing-library.com/docs/react-testing-library/intro/">React Testing Library</a></div>,
          "Unit tests take full advantage of Jest's powerful mocking and spying systems to properly isolate subject components",
          <div>Frontend tests use the <a href="https://mswjs.io/">Mock Service Worker</a> library to mock API requests. This allows interception of requests at the network level, and hence makes tests independent of the request library used, in turn making tests more resilient to changes</div>
        ]}
        visuals={{
          desktop: { images: [{ imgLink: FrontendTestImg, width: "520px", height: "321px" }] },
          mobile: {
            custom: <CodeBlock
              language="javascript"
              showLineNumbers={true}
              // eslint-disable-next-line no-template-curly-in-string
              text={'describe("When given 5 lines", () => {\n\tconst COUNT = 5\n\n\tit(`Displays ${COUNT} lines`, () => {\n\t\trender(<LineCounter count={COUNT} />)\n\t\tconst lines = screen.getAllByText(/d/)\n\n\t\texpect(lines).toHaveLength(COUNT)\n\t\tfor (let i = 0; i < lines.length; i++) {\n\t\t\texpect(lines[i]).toHaveTextContent(`${i + 1}`)\n\t\t}\n\t})\n})'}
              theme={dracula}
              customStyle={{
                borderRadius: "10px",
                fontWeight: "600",
                boxShadow: "0px 0px 4px 3px #bababa",
                width: "100%",
                tabSize: "4"
              }}
            />
          }
        }}
      />
      <FeatureDisplayCard
        title="End-to-End Testing"
        notes={[
          <div>Extensive end-to-end testing of the website is done using the <a href="https://www.cypress.io/">Cypress</a> testing framework</div>,
          <div>Tests make strict adherence to good end-to-end testing practices as <a href="https://docs.cypress.io/guides/references/best-practices">recommended by Cypress</a>, avoiding anti-patterns and following common design principles, to ensure resilience</div>
        ]}
        visuals={{
          desktop: {
            custom: <video loop autoPlay muted width="597px" height="335px">
              <source src={process.env.PUBLIC_URL + "/assets/cypressViewBlog.mp4"} type="video/mp4" />
            </video>
          },
          mobile: {
            custom: <div>Nothing for now!</div>
          }
        }}
        theme="dark"
      />
      <FeatureDisplayCard
        title="Continuous Integration"
        notes={[
          <div><a href="https://github.com/features/actions">Github Actions</a> is used for the CI process of both the backend and frontend</div>,
          "All unit, integration and end-to-end tests are run automatically upon any commit to the code, or any merging of branches, to minimize the chance of bugs being introduced",
          <div>An example of one of the CI flows used for this app can be viewed <a href="https://github.com/kyfohatl/portfolio-website-frontend/blob/main/.github/workflows/test.yml">here</a></div>
        ]}
        visuals={{
          desktop: { images: [{ imgLink: GithubActionsImg, width: "600px", height: "391px" }] },
          mobile: { images: [{ imgLink: GithubActionsImg, width: MOB_IMG_WIDTH }] }
        }}
      />
      <FeatureDisplayCard
        title="Upcoming Features"
        notes={[
          "Full mobile site support, with completely new designs of most pages specifically for smaller screens",
          "Even more animations, including a WebGL powered Hero",
          "User profile pages",
          "Improvements to the blog editor",
          "Additional features for blogs, such as liking and sharing",
          "And more!"
        ]}
        visuals={{
          desktop: { images: [{ imgLink: UpcomingCodeImg, width: "426px", height: "569px" }] },
          mobile: { images: [{ imgLink: UpcomingCodeImg, width: MOB_IMG_WIDTH }] }
        }}
        theme="dark"
      />
      <FeatureDisplayCard
        title="Techstack &amp; Tools"
        notes={[
          "React, Typescript, HTML and CSS are used to create the frontend",
          "NodeJs is used for the backend",
          "ExpressJs is used for the backend's REST API",
          "Json Web Token (JWT) and Bcrypt are used for authentication",
          "PostgreSQL for database management",
          "Heroku for deployment of both backend and frontend",
          "JEST, React Testing Library and Cypress for testing",
          "Git and Github are used for repository management and source control",
          "Github Actions for CI",
          "Figma for designs"
        ]}
        visuals={{
          desktop: {
            custom: <LogoContainer>
              <img alt="React Logo" src={ReactLogo} width="95px" height="88px" />
              <img alt="Typescript Logo" src={TypeScriptLogo} width="80px" height="80px" />
              <HtmlLogo style={{ width: "101px", height: "101px" }} />
              <img alt="CSS Logo" src={CssLogo} width="78px" height="110px" />
              <img alt="NodeJs Logo" src={NodeJsLogo} width="101px" height="62px" />
              <img alt="Express Logo" src={ExpressLogo} width="115px" height="35px" />
              <img alt="JWT Logo" src={JwtLogo} width="114px" height="38px" />
              <img alt="Postgres Logo" src={PostgresLogo} width="89px" height="93px" />
              <img alt="Heroku Logo" src={HerokuLogo} width="123px" height="35px" />
              <img alt="Jest Logo" src={JestLogo} width="78px" height="86px" />
              <img alt="React Testing Library Logo" src={ReactTestingLibLogo} width="77px" height="77px" />
              <img alt="Cypress Logo" src={CypressLogo} width="120px" height="30px" />
              <img alt="Git Logo" src={GitLogo} width="77px" height="77px" />
              <img alt="Github Logo" src={GitHubLogo} width="74px" height="74px" />
              <img alt="Github Actions Logo" src={GithubActionsLogo} width="77px" height="77px" />
              <img alt="Figma Logo" src={FigmaLogo} width="56px" height="84px" />
            </LogoContainer>
          },
          mobile: {
            custom: <LogoContainer>
              <img alt="React Logo" src={ReactLogo} width="50px" />
              <img alt="Typescript Logo" src={TypeScriptLogo} width="40px" />
              <HtmlLogo style={{ width: "50px" }} />
              <img alt="CSS Logo" src={CssLogo} width="40px" />
              <img alt="NodeJs Logo" src={NodeJsLogo} width="60px" />
              <img alt="Express Logo" src={ExpressLogo} width="90px" />
              <img alt="JWT Logo" src={JwtLogo} width="70px" />
              <img alt="Postgres Logo" src={PostgresLogo} width="50px" />
              <img alt="Heroku Logo" src={HerokuLogo} width="70px" />
              <img alt="Jest Logo" src={JestLogo} width="40px" />
              <img alt="React Testing Library Logo" src={ReactTestingLibLogo} width="50px" />
              <img alt="Cypress Logo" src={CypressLogo} width="90px" />
              <img alt="Git Logo" src={GitLogo} width="50px" />
              <img alt="Github Logo" src={GitHubLogo} width="44px" />
              <img alt="Github Actions Logo" src={GithubActionsLogo} width="50px" />
              <img alt="Figma Logo" src={FigmaLogo} width="40px" />
            </LogoContainer>
          }
        }}
      />
    </PageContainer>
  )
}
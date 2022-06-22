import "./Home.css"
import PageContainer from "../components/PageContainer"
import FeatureDisplayCard from "../components/FeatureDisplayCard"

import CreateBlogImg from "../assets/images/homePageDemos/create_blog.png"
import SummaryImg from "../assets/images/homePageDemos/summary_removedBg_focused.png"
import SummaryCardImg from "../assets/images/homePageDemos/summary_card.png"
import EditBlogImg from "../assets/images/homePageDemos/edit_blog.png"
import ViewBlogsImg from "../assets/images/homePageDemos/view_blogs_removedBg.png"
import SignUpImg from "../assets/images/homePageDemos/sign_up.png"
import ThirdPartyLoginImg from "../assets/images/homePageDemos/google_facebook_removedBg.png"
import Hero from "../components/Hero"
import { useCallback, useRef } from "react"

export default function Home() {
  // For scrolling to the first feature display card upon clicking the "Explore" button
  const firstFeatureRef = useRef<HTMLDivElement>(null)
  const onExploreClick = useCallback(() => {
    if (!firstFeatureRef.current) return
    firstFeatureRef.current.scrollIntoView({ behavior: "smooth" })
  }, [])

  return (
    <PageContainer
      contentBlockStyle={{ maxWidth: "100vw", display: "flex", flexDirection: "column" }}
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
        images={[{ imgLink: CreateBlogImg, width: "594px", height: "526px" }]}
        ref={firstFeatureRef}
      />
      <FeatureDisplayCard
        title="Summarize Your Blogs"
        notes={[
          "Use the popular Open Graph (OG) protocol to write a summary of your blog",
          "Your blog summary is then displayed on the main blogs page, where it can entice viewers to click on your blog and read it",
          "The OG protocol implementation has the added benefit of being automatically compatible with many social media platforms. When sharing your blog on sites such as Facebook and LinkedIn, your summary will be displayed.",
          "Use the “keywords” meta tag to add tags to your blog, which will be displayed on the summary card"
        ]}
        images={[
          { imgLink: SummaryImg, width: "593px", height: "492px" },
          { imgLink: SummaryCardImg, width: "593px", height: "119px" }
        ]}
        theme="dark"
      />
      <FeatureDisplayCard
        title="Edit and Delete Blogs"
        notes={[
          "Edit or delete any of the blogs that you created at any time by clicking on the “Edit” and “Delete” buttons",
          "Clicking “Edit” will open the blog's HTML and CSS in the website's blog editor tool"
        ]}
        images={[{ imgLink: EditBlogImg, width: "593px", height: "691px" }]}
      />
      <FeatureDisplayCard
        title="Read Blogs"
        notes={[
          "View the summaries of your own blogs, as well as the works of other creators on the main blogs page",
          "Summaries are neatly contained and separated by animated blog cards",
          "Click on any of them to view the full blog",
          "Addition blogs are loaded automatically as you scroll towards the bottom of the page",
          "Upcoming features: Search and sort"
        ]}
        images={[{ imgLink: ViewBlogsImg, width: "593px", height: "690px" }]}
        theme="dark"
      />
      <FeatureDisplayCard
        title="Login"
        notes={[
          "Custom authentication system built using the Json Web Token (JWT) and BCrypt frameworks",
          "Uses Access and Refresh tokens to verify the authenticity of communications between the frontend and backend",
          "Uses HTTP-only cookies to store tokens safely (instead of browser local storage), preventing an XSS attacker from stealing them",
          "Automatic extension of sessions using refresh tokens"
        ]}
        images={[{ imgLink: SignUpImg, width: "480px", height: "491px" }]}
      />
      <FeatureDisplayCard
        title="Google and Facebook Login"
        notes={[
          "Uses the OpenID Client protocol to securely verify a user with a third party authenticator (Google and Facebook)",
          "After the first third party sign in, an account is created for the user on the backend automatically. Subsequent third party logins will invoke the user account",
          "Only requests an id_token, and not an OAuth2.0 access code. This ensures that only the bare minimum required information is given to this website's system (mainly email and user id)"
        ]}
        images={[{ imgLink: ThirdPartyLoginImg, width: "480px", height: "504px" }]}
        theme="dark"
      />
    </PageContainer>
  )
}
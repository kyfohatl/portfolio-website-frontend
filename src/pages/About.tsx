import TutorialCard from "../components/tutorial/TutorialCard";
import HelpImage from "../assets/images/tutorial/editBlogTutorials/help.png"
import TutorialArrow from "../components/tutorial/TutorialArrow";

export default function About() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "50px", marginLeft: "20px" }}>
      <p>This is the about page!</p>
      <TutorialCard
        title="Tutorial"
        notes="Click the help icon to find out more about writing blogs"
        image={HelpImage}
        imgAlt="Edit blog help"
        pos={{ left: "200px", top: "200px" }}
        onClose={() => { }}
      />
      <TutorialArrow left="600px" top="100px" rotation={235} width="50px" height="200px" />
    </div>
  )
}
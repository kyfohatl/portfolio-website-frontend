import { FeatureDisplayCardProps } from "../components/FeatureDisplayCard";

// Images
import CodeBase from "../assets/images/editBlogPageHelp/summaryCodeBase.png"
import CardBase from "../assets/images/editBlogPageHelp/blogCardEffectBase2.png"

const CARD_DIMENSIONS = { width: "800px", height: "600px" }
const BORDER_RADIUS = "40px"
const MIDDLE_GAP = "40px"
const MAX_TEXT_WIDTH = "300px"

export const cardProps: FeatureDisplayCardProps[] = [
  {
    title: "Summarise",
    notes: [
      "Summarise your blogs by using Open Graph Protocol meta tags in the header",
      "Blog summaries will be displayed on the blogs page, and will entice viewers to click on your blog"
    ],
    visuals: {
      images: [
        { imgLink: CodeBase, width: "330px", height: "312px" },
        { imgLink: CardBase, width: "330px", height: "127px" }
      ]
    },
    dimensions: CARD_DIMENSIONS,
    borderRadius: BORDER_RADIUS,
    middleGap: MIDDLE_GAP,
    textLineSize: MAX_TEXT_WIDTH
  }
]
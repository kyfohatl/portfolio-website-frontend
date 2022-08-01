import { FeatureDisplayCardProps } from "../components/FeatureDisplayCard";

// Images
import CodeBase from "../assets/images/editBlogPageHelp/summaryCodeBase.png"
import CodeTitle from "../assets/images/editBlogPageHelp/summaryCodeTitle.png"
import CodeDescription from "../assets/images/editBlogPageHelp/summaryCodeDescription.png"
import CodeImage from "../assets/images/editBlogPageHelp/summaryCodeImage.png"
import CodeTags from "../assets/images/editBlogPageHelp/summaryCodeTags.png"

import CardBase from "../assets/images/editBlogPageHelp/blogCardEffectBase2.png"
import CardTitle from "../assets/images/editBlogPageHelp/blogCardEffectTitle2.png"
import CardDescription from "../assets/images/editBlogPageHelp/blogCardEffectDescription2.png"
import CardImage from "../assets/images/editBlogPageHelp/blogCardEffectImage2.png"
import CardTags from "../assets/images/editBlogPageHelp/blogCardEffectTags2.png"

const CODE_IMG_WIDTH = "330px"
const CODE_IMG_HEIGHT = "312px"

const SUMMARY_CARD_IMG_WIDTH = "330px"
const SUMMARY_CARD_IMG_HEIGHT = "127px"

const CARD_DIMENSIONS = { width: "800px", height: "600px" }
const BORDER_RADIUS = "40px"
const MIDDLE_GAP = "40px"
const MAX_TEXT_WIDTH = "300px"

interface createCardPropsArg {
  title: string,
  notes: string[],
  codeImage: string,
  summaryCardImage: string
}

function createCardProps(cardInfoList: createCardPropsArg[]) {
  const cardProps: FeatureDisplayCardProps[] = []
  for (const cardInfo of cardInfoList) {
    cardProps.push({
      title: cardInfo.title,
      notes: cardInfo.notes,
      visuals: {
        images: [
          { imgLink: cardInfo.codeImage, width: CODE_IMG_WIDTH, height: CODE_IMG_HEIGHT },
          { imgLink: cardInfo.summaryCardImage, width: SUMMARY_CARD_IMG_WIDTH, height: SUMMARY_CARD_IMG_HEIGHT }
        ]
      },
      dimensions: CARD_DIMENSIONS,
      borderRadius: BORDER_RADIUS,
      middleGap: MIDDLE_GAP,
      textLineSize: MAX_TEXT_WIDTH
    })
  }

  return cardProps
}

export const cardProps: FeatureDisplayCardProps[] = createCardProps([
  {
    title: "Summarise",
    notes: [
      "Summarise your blogs by placing Open Graph Protocol meta tags in the header of your html document",
      "Blog summaries will be displayed on the blogs page, enticing viewers to click on your blog"
    ],
    codeImage: CodeBase,
    summaryCardImage: CardBase
  },
  {
    title: "Titles",
    notes: [
      "Use \"og:title\" to provide a title for your summary",
      "To do so, place property=\"og:title\" inside your meta tag, followed by content=\"[the title of your blog]\"",
      "This title will be displayed at the top of your blog summary"
    ],
    codeImage: CodeTitle,
    summaryCardImage: CardTitle
  },
  {
    title: "Descriptions",
    notes: [
      "Use \"og:description\" to provide a brief description of your blog",
      "To do so, place property=\"og:description\" inside your meta tag, followed by content=\"[your summary description]\"",
      "This description will be displayed on you blog summary and entice viewers to read your blog"
    ],
    codeImage: CodeDescription,
    summaryCardImage: CardDescription
  },
  {
    title: "Images",
    notes: [
      "Use \"og:image\" to provide an image for your summary",
      "To do so, place property=\"og:image\" inside of your meta tag, followed by content=\"[link to the image]\"",
      "This will help grab the viewers attention as they scroll through the blogs"
    ],
    codeImage: CodeImage,
    summaryCardImage: CardImage
  },
  {
    title: "Tags",
    notes: [
      "Use the \"keywords\" meta tag to provide a list of tags for your image",
      "To do so, place name=\"keywords\" inside of your meta tag, followed by content=\"[A comma separated list of your tags]\"",
      "Tags will give viewers a general idea of the topics covered by your blog, and will be used in the future for search and sorting purposes"
    ],
    codeImage: CodeTags,
    summaryCardImage: CardTags
  }
])
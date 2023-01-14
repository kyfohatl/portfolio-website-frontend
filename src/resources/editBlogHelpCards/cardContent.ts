import { FeatureDisplayCardProps } from "../../components/FeatureDisplayCard";

// Images
import CodeBase from "../../assets/images/editBlogPageHelp/summaryCodeBase.png"
import CodeTitle from "../../assets/images/editBlogPageHelp/summaryCodeTitle.png"
import CodeDescription from "../../assets/images/editBlogPageHelp/summaryCodeDescription.png"
import CodeImage from "../../assets/images/editBlogPageHelp/summaryCodeImage.png"
import CodeTags from "../../assets/images/editBlogPageHelp/summaryCodeTags.png"

import CardBase from "../../assets/images/editBlogPageHelp/blogCardEffectBase2.png"
import CardTitle from "../../assets/images/editBlogPageHelp/blogCardEffectTitle2.png"
import CardDescription from "../../assets/images/editBlogPageHelp/blogCardEffectDescription2.png"
import CardImage from "../../assets/images/editBlogPageHelp/blogCardEffectImage2.png"
import CardTags from "../../assets/images/editBlogPageHelp/blogCardEffectTags2.png"

import { cardTexts } from "./cardTexts";
import { WithRequiredType } from "../../lib/typeHelpers/withRequiredType";

const CODE_IMG_WIDTH = "330px"
const CODE_IMG_HEIGHT = "312px"

const SUMMARY_CARD_IMG_WIDTH = "330px"
const SUMMARY_CARD_IMG_HEIGHT = "127px"

const CARD_DIMENSIONS = { desktop: { w: "800px", h: "600px" }, mobile: { w: "300px", h: "70vh" } }
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
  const cardProps: WithRequiredType<FeatureDisplayCardProps, "dimensions">[] = []
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

export const cardProps: WithRequiredType<FeatureDisplayCardProps, "dimensions">[] = createCardProps([
  {
    title: cardTexts[0].title,
    notes: cardTexts[0].notes,
    codeImage: CodeBase,
    summaryCardImage: CardBase
  },
  {
    title: cardTexts[1].title,
    notes: cardTexts[1].notes,
    codeImage: CodeTitle,
    summaryCardImage: CardTitle
  },
  {
    title: cardTexts[2].title,
    notes: cardTexts[2].notes,
    codeImage: CodeDescription,
    summaryCardImage: CardDescription
  },
  {
    title: cardTexts[3].title,
    notes: cardTexts[3].notes,
    codeImage: CodeImage,
    summaryCardImage: CardImage
  },
  {
    title: cardTexts[4].title,
    notes: cardTexts[4].notes,
    codeImage: CodeTags,
    summaryCardImage: CardTags
  }
])
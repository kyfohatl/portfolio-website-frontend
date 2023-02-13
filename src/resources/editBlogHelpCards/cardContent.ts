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
  notes: string[] | JSX.Element[],
  codeImageDesktop: string,
  summaryCardImageDesktop: string
}

function createCardProps(cardInfoList: createCardPropsArg[]) {
  const cardProps: WithRequiredType<FeatureDisplayCardProps, "dimensions">[] = []
  for (const cardInfo of cardInfoList) {
    cardProps.push({
      title: cardInfo.title,
      notes: cardInfo.notes,
      visuals: {
        desktop: {
          images: [
            { imgLink: cardInfo.codeImageDesktop, width: CODE_IMG_WIDTH, height: CODE_IMG_HEIGHT },
            { imgLink: cardInfo.summaryCardImageDesktop, width: SUMMARY_CARD_IMG_WIDTH, height: SUMMARY_CARD_IMG_HEIGHT }
          ]
        },
        mobile: {}
      },
      dimensions: CARD_DIMENSIONS,
      borderRadius: BORDER_RADIUS,
      middleGap: MIDDLE_GAP,
      textLineSize: MAX_TEXT_WIDTH,
      noteListStyle: "borders"
    })
  }

  return cardProps
}

export const cardProps: WithRequiredType<FeatureDisplayCardProps, "dimensions">[] = createCardProps([
  {
    title: cardTexts[0].title,
    notes: cardTexts[0].notes,
    codeImageDesktop: CodeBase,
    summaryCardImageDesktop: CardBase
  },
  {
    title: cardTexts[1].title,
    notes: cardTexts[1].notes,
    codeImageDesktop: CodeTitle,
    summaryCardImageDesktop: CardTitle
  },
  {
    title: cardTexts[2].title,
    notes: cardTexts[2].notes,
    codeImageDesktop: CodeDescription,
    summaryCardImageDesktop: CardDescription
  },
  {
    title: cardTexts[3].title,
    notes: cardTexts[3].notes,
    codeImageDesktop: CodeImage,
    summaryCardImageDesktop: CardImage
  },
  {
    title: cardTexts[4].title,
    notes: cardTexts[4].notes,
    codeImageDesktop: CodeTags,
    summaryCardImageDesktop: CardTags
  }
])
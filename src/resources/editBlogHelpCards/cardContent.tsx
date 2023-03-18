import { FeatureDisplayCardProps } from "../../components/FeatureDisplayCard";
import styles from "./cardContent.module.css"

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

import MobileCardBase from "../../assets/images/editBlogPageHelp/mobile/summaryBase.png"
import MobileCardTitle from "../../assets/images/editBlogPageHelp/mobile/summaryTitle.png"
import MobileCardImage from "../../assets/images/editBlogPageHelp/mobile/summaryImage.png"
import MobileCardTags from "../../assets/images/editBlogPageHelp/mobile/summaryTags.png"

import { cardTexts } from "./cardTexts";
import { WithRequiredType } from "../../lib/typeHelpers/withRequiredType";
import { CodeBlock, dracula } from "react-code-blocks";

const CODE_IMG_WIDTH = "330px"
const CODE_IMG_HEIGHT = "312px"

const SUMMARY_CARD_IMG_WIDTH = "330px"
const SUMMARY_CARD_IMG_HEIGHT = "127px"

const SUMMARY_CARD_MOBILE_IMG_WIDTH = "236px"

const CARD_DIMENSIONS = { desktop: { w: "800px", h: "600px" }, mobile: { w: "300px", h: "70vh" } }
const BORDER_RADIUS = "40px"
const MIDDLE_GAP = "40px"
const MAX_TEXT_WIDTH = "300px"

interface createCardPropsArg {
  title: string,
  notes: string[] | JSX.Element[],
  desktop: { codeImage: string, summaryCardImage: string },
  mobile: { code: string, image?: string }
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
            {
              imgLink: cardInfo.desktop.codeImage,
              width: CODE_IMG_WIDTH,
              height: CODE_IMG_HEIGHT
            },
            {
              imgLink: cardInfo.desktop.summaryCardImage,
              width: SUMMARY_CARD_IMG_WIDTH,
              height: SUMMARY_CARD_IMG_HEIGHT
            }
          ]
        },
        mobile: {
          custom: <div className={styles.mobileImgContainer}>
            <CodeBlock
              language="html"
              showLineNumbers={true}
              text={cardInfo.mobile.code}
              theme={dracula}
              customStyle={{
                borderRadius: "10px",
                fontWeight: "600",
                boxShadow: "0px 0px 4px 3px #bababa",
                width: "100%"
              }}
            />
            {
              cardInfo.mobile.image &&
              <img
                className={styles.mobileImg}
                alt="summary card"
                src={cardInfo.mobile.image}
                width={SUMMARY_CARD_MOBILE_IMG_WIDTH}
              />
            }
          </div>
        }
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
    desktop: { codeImage: CodeBase, summaryCardImage: CardBase },
    mobile: { code: cardTexts[0].code, image: MobileCardBase }
  },
  {
    title: cardTexts[1].title,
    notes: cardTexts[1].notes,
    desktop: { codeImage: CodeTitle, summaryCardImage: CardTitle },
    mobile: { code: cardTexts[1].code, image: MobileCardTitle }
  },
  {
    title: cardTexts[2].title,
    notes: cardTexts[2].notes,
    desktop: { codeImage: CodeDescription, summaryCardImage: CardDescription },
    mobile: { code: cardTexts[2].code }
  },
  {
    title: cardTexts[3].title,
    notes: cardTexts[3].notes,
    desktop: { codeImage: CodeImage, summaryCardImage: CardImage },
    mobile: { code: cardTexts[3].code, image: MobileCardImage }
  },
  {
    title: cardTexts[4].title,
    notes: cardTexts[4].notes,
    desktop: { codeImage: CodeTags, summaryCardImage: CardTags },
    mobile: { code: cardTexts[4].code, image: MobileCardTags }
  }
])
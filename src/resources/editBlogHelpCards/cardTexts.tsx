import styles from "./cardTexts.module.css"
import { titles } from "./cardTitles"

interface CardTexts {
  title: string,
  notes: JSX.Element[],
  code: string
}

export const cardTexts: CardTexts[] = [
  {
    title: titles[0],
    notes: [
      <p className={styles.text}>
        Summarise your blogs by placing <strong>Open Graph Protocol</strong> meta tags in the header of your
        html document
      </p>,
      <p className={styles.text}>
        Blog summaries will be displayed on the blogs page, enticing viewers to click on your blog
      </p>
    ],
    code: '<meta property="og:title"/>\n<meta property="og:description"/>\n<meta property="og:image"/>\n<meta name="keywords"/>'
  },
  {
    title: titles[1],
    notes: [
      <p className={styles.text}>Use <strong>og:title</strong> to provide a title for your summary</p>,
      <p className={styles.text}>
        To do so, place <strong>property="og:title"</strong> inside your meta tag, followed
        by <strong>content="<i>[the title of your blog]</i>"</strong>
      </p>,
      <p className={styles.text}>This title will be displayed at the top of your blog summary</p>
    ],
    code: '<meta\n\tproperty="og:title"\n\tcontent="Sample Summary Title"\n/>'
  },
  {
    title: titles[2],
    notes: [
      <p className={styles.text}>Use <strong>og:description</strong> to provide a brief description of your blog</p>,
      <p className={styles.text}>
        To do so, place <strong>property="og:description"</strong> inside your meta tag, followed
        by <strong>content="<i>[your summary description]</i>"</strong>
      </p>,
      <p className={styles.text}>
        This description will be displayed on you blog summary and entice viewers to read your blog
      </p>
    ],
    code: '<meta\n\tproperty="og:description"\n\tcontent="This is a sample description"\n/>'
  },
  {
    title: titles[3],
    notes: [
      <p className={styles.text}>Use <strong>og:image</strong> to provide an image for your summary</p>,
      <p className={styles.text}>
        To do so, place <strong>property="og:image"</strong> inside of your meta tag, followed
        by <strong>content="<i>[link to the image]</i>"</strong>
      </p>,
      <p className={styles.text}>This will help grab the viewers attention as they scroll through the blogs</p>
    ],
    code: '<meta\n\tproperty="og:image"\n\tcontent="https://someImageAddress.com"\n/>'
  },
  {
    title: titles[4],
    notes: [
      <p className={styles.text}>
        Use the <strong>keywords</strong> meta tag to provide a list of tags for your image
      </p>,
      <p className={styles.text}>
        To do so, place <strong>name="keywords"</strong> inside of your meta tag, followed
        by <strong>content="<i>[A comma separated list of your tags]</i>"</strong>
      </p>,
      <p className={styles.text}>
        Tags will give viewers a general idea of the topics covered by your blog, and will be used in the future for
        search and sorting purposes
      </p>
    ],
    code: '<meta\n\tname="keywords"\n\tcontent="Tutorial, Sample, Display"\n/>'
  }
]
import { useState } from "react";
import { TextInfo } from "../components/blog/EditorBody";
import MobileEditor from "../components/blog/mobile/MobileEditor";

export default function Test() {
  const [htmlText, setHtmlText] = useState<TextInfo>({ text: "", change: { changeType: "Other" } })
  const [cssText, setCssText] = useState<TextInfo>({ text: "", change: { changeType: "Other" } })

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <MobileEditor
        html={{ title: "html", textInfo: htmlText, setText: setHtmlText }}
        css={{ title: "css", textInfo: cssText, setText: setCssText }}
      />
    </div>
  )
}
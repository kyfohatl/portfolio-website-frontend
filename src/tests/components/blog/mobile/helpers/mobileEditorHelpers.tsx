import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditorType } from "../../../../../components/blog/EditorTitle";

function switchEditor(editor: EditorType) {
  const title = within(screen.getByTestId("mobileEditorContainer")).getByTestId("editorTitle_" + editor)
  userEvent.click(title)
}

async function switchEditorAsync(editor: EditorType) {
  const title = within(await screen.findByTestId("mobileEditorContainer")).getByTestId("editorTitle_" + editor)
  userEvent.click(title)
}

export function checkMobileEditorForContent(content: string, editor: EditorType | "both", not: boolean = false) {
  const mobileEditor = within(screen.getByTestId("mobileEditor")).getByRole("textbox")

  // Check the html
  switchEditor("html")
  if (editor === "html" || editor === "both") {
    if (not) {
      expect(mobileEditor).not.toHaveTextContent(content)
    } else {
      expect(mobileEditor).toHaveTextContent(content)
    }

    if (editor !== "both") return
  }

  // Check the css
  switchEditor("css")
  if (not) {
    expect(mobileEditor).not.toHaveTextContent(content)
  } else {
    expect(mobileEditor).toHaveTextContent(content)
  }
}

export async function checkMobileEditorForContentAsync(
  content: string,
  editor: EditorType | "both",
  not: boolean = false
) {
  const mobileEditor = within(await screen.findByTestId("mobileEditor")).getByRole("textbox")

  // Check the html
  await switchEditorAsync("html")
  if (editor === "html" || editor === "both") {
    if (not) {
      expect(mobileEditor).not.toHaveTextContent(content)
    } else {
      expect(mobileEditor).toHaveTextContent(content)
    }

    if (editor !== "both") return
  }

  // Check the css
  await switchEditorAsync("css")
  if (not) {
    expect(mobileEditor).not.toHaveTextContent(content)
  } else {
    expect(mobileEditor).toHaveTextContent(content)
  }
}

export function typeContentIntoMobileEditor(content: string, editor: EditorType | "both") {
  const mobileEditor = within(screen.getByTestId("mobileEditor")).getByRole("textbox")

  // Type in the html
  switchEditor("html")
  if (editor === "html" || editor === "both") {
    userEvent.type(mobileEditor, content)
    if (editor !== "both") return
  }

  // Type in the css
  switchEditor("css")
  userEvent.type(mobileEditor, content)
}

export async function typeContentIntoMobileEditorAsync(content: string, editor: EditorType | "both") {
  const mobileEditor = within(await screen.findByTestId("mobileEditor")).getByRole("textbox")

  // Type in the html
  await switchEditorAsync("html")
  if (editor === "html" || editor === "both") {
    userEvent.type(mobileEditor, content)
    if (editor !== "both") return
  }

  // Type in the css
  await switchEditorAsync("css")
  userEvent.type(mobileEditor, content)
}
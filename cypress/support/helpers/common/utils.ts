import { ViewportName, VIEWPORT_DIMENSIONS } from "../../constants/screenSizes"

// Runs the tests in the given test function over the given viewports
// If no viewports are provided, all viewport sizes will be tested
export function testViewports(testFn: () => void, viewports?: ViewportName[]) {
  // If the viewports list is given, test only for those viewports. Otherwise test all viewports
  const viewportNames = viewports || Object.keys(VIEWPORT_DIMENSIONS) as ViewportName[]

  viewportNames.forEach(viewportName => {
    const viewport = VIEWPORT_DIMENSIONS[viewportName]

    describe(viewportName, () => {
      beforeEach(() => {
        cy.viewport(viewport.pixelWidth, viewport.pixelHeight)
      })

      testFn()
    })
  })
}
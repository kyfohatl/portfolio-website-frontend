import React, { useCallback, useState } from "react"
import Button, { ButtonProps } from "../../Button"
import AnimationProps from "../AnimationProps"
import { DeletingProps, DeletingStyleOverrides } from "../Deleting"
import { QuestionMarkProps, QuestionMarkStyleOverrides } from "../QuestionMark"
import { SavingProps, SavingStyleOverrides } from "../Saving"

type AnimComponentProps =
  {
    component: React.FC<QuestionMarkProps>,
    props: Omit<QuestionMarkProps, keyof AnimationProps>,
    override: QuestionMarkStyleOverrides
  } |
  {
    component: React.FC<DeletingProps>,
    props: Omit<DeletingProps, keyof AnimationProps>,
    override: DeletingStyleOverrides
  } |
  {
    component: React.FC<SavingProps>,
    props: Omit<SavingProps, keyof AnimationProps>,
    override: SavingStyleOverrides
  }

interface RepeatingAnimationProps {
  animComponentProps: AnimComponentProps,
  buttonProps: Omit<ButtonProps, "icon">
}

export default function RepeatingAnimation({
  animComponentProps,
  buttonProps
}: RepeatingAnimationProps) {
  const [animStyles, setAnimStyles] = useState<typeof animComponentProps.override>()

  const onAnimationEnd = useCallback(() => {
    // Create a copy of the template
    const clearAnimStyles = { ...animComponentProps.override }
    // Replace all animation names with "none" to clear the animation
    for (const [, v] of Object.entries(clearAnimStyles)) {
      v.animationName = "none"
    }

    setAnimStyles(clearAnimStyles)

    // After some time, remove the "none" from all animations to restart the animation
    setTimeout(() => {
      const restartAnimStyles = { ...animComponentProps.override }
      for (const [, v] of Object.entries(clearAnimStyles)) {
        v.animationName = ""
      }

      setAnimStyles(restartAnimStyles)
    }, 1000)
  }, [animComponentProps.override])

  const Animation = animComponentProps.component

  return (
    <Button
      {...buttonProps}
      // @ts-ignore: For some reason typescript is not recognizing that the props and component must be of the same type
      icon={<Animation {...animComponentProps.props} overrides={animStyles} onAnimationEnd={onAnimationEnd} />}
    />
  )
}
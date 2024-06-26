import 'blockly/blocks'

import { Expression } from '@cucumber/cucumber-expressions'
import { Suggestion } from '@cucumber/language-service'
import React, { useEffect } from 'react'

import { mount } from '../src/index.js'

export type CucumberBlocklyProps = {
  initialGherkinSource: string
  suggestions: readonly Suggestion[]
  expressions: readonly Expression[]
  setError: (error: string | undefined) => void
  setGherkinSource: (gherkinSources: string) => void
  setWorkspaceXml: (xml: string) => void
}

export const CucumberBlockly: React.FunctionComponent<CucumberBlocklyProps> = ({
  initialGherkinSource,
  suggestions,
  expressions,
  setError,
  setGherkinSource,
  setWorkspaceXml,
}) => {
  const blocklyDiv = React.createRef<HTMLDivElement>()

  useEffect(() => {
    if (!blocklyDiv.current) return
    return mount(
      blocklyDiv.current,
      initialGherkinSource,
      suggestions,
      expressions,
      'media',
      (err, gherkinSource, workspaceXml) => {
        setError(err ? err.stack : undefined)
        setGherkinSource(gherkinSource || '')
        setWorkspaceXml(workspaceXml || '')
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialGherkinSource, suggestions, expressions])

  return <div ref={blocklyDiv} />
}

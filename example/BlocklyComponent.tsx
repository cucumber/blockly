import 'blockly/blocks'

import { Expression } from '@cucumber/cucumber-expressions'
import { Suggestion } from '@cucumber/language-service'
import React, { useEffect, useMemo } from 'react'

import { mount } from '../src/index.js'

type Props = {
  initialGherkinSource: string
  suggestions: readonly Suggestion[]
  expressions: readonly Expression[]
  setWorkspaceXml: (xml: string) => void
  setGherkinSource: (gherkinSources: string) => void
  setError: (error: string | undefined) => void
}

const BlocklyComponent: React.FunctionComponent<Props> = ({
  initialGherkinSource,
  suggestions,
  expressions,
  setWorkspaceXml,
  setGherkinSource,
  setError,
}) => {
  const blocklyDiv = React.createRef<HTMLDivElement>()
  const blocklyXmlDiv = React.createRef<HTMLDivElement>()

  useEffect(() => {
    if (!(blocklyDiv.current && blocklyXmlDiv.current)) return
    return mount(
      blocklyDiv.current,
      blocklyXmlDiv.current,
      initialGherkinSource,
      suggestions,
      expressions,
      (err, workspaceXml, gherkinSource) => {
        setError(err ? err.stack : undefined)
        setWorkspaceXml(workspaceXml || '')
        setGherkinSource(gherkinSource || '')
      }
    )
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  }, [initialGherkinSource, suggestions, expressions])

  return (
    <div>
      <div ref={blocklyDiv} id="blocklyDiv" />
      <div style={{ display: 'none' }} ref={blocklyXmlDiv} id="blocklyXmlDiv" />
    </div>
  )
}

export default BlocklyComponent

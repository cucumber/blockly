import 'blockly/blocks'

import { Suggestion } from '@cucumber/language-service'
import { GherkinDocument } from '@cucumber/messages'
import Blockly from 'blockly'
import { BlocklyOptions } from 'core/blockly_options'
import React, { useEffect, useMemo } from 'react'

import { makeGenerator } from './makeGenerator'

type Props = {
  workspaceXml: string
  suggestions: readonly Suggestion[]
  setWorkspaceXml: (xml: string) => void
  setGherkinSources: (gherkinSources: readonly string[]) => void
  options: BlocklyOptions
}

const BlocklyComponent: React.FunctionComponent<Props> = ({
  workspaceXml,
  suggestions,
  setWorkspaceXml,
  setGherkinSources,
  options,
}) => {
  const toolbox = useMemo(
    () => `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="feature"/>
  <block type="rule"/>
  <block type="background"/>
  <block type="scenario"/>
  <block type="step"/>
  ${suggestions.map((suggestion) => `<block type="${suggestion.label}"/>`)}
</xml>
`,
    [suggestions]
  )

  const generator = useMemo(() => makeGenerator(suggestions), [suggestions])

  const blocklyDiv = React.createRef<HTMLDivElement>()

  useEffect(() => {
    if (!blocklyDiv.current) return
    const workspace = Blockly.inject(blocklyDiv.current, { ...options, toolbox })

    // @ts-ignore
    workspace.addChangeListener(() => {
      generator.init(workspace)
      const xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace))
      setWorkspaceXml(xml)

      const blocks = workspace.getTopBlocks(true)
      const gherkinSources = blocks.map((block: Blockly.Block) => generator.blockToCode(block))
      setGherkinSources(gherkinSources)
    })

    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspaceXml), workspace)

    return () => workspace.dispose()
  }, [generator, setWorkspaceXml, toolbox /*blocklyDiv, options, workspaceXml*/])

  return <div ref={blocklyDiv} id="blocklyDiv" />
}

export default BlocklyComponent

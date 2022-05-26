import 'blockly/blocks'

import { Suggestion } from '@cucumber/language-service'
import { GherkinDocument } from '@cucumber/messages'
import Blockly from 'blockly'
import { BlocklyOptions } from 'core/blockly_options'
import React, { useEffect } from 'react'

type Props = {
  workspaceXml: string
  suggestions: readonly Suggestion[]
  setWorkspaceXml: (xml: string) => void
  setGherkinDocuments: (gherkinDocument: readonly GherkinDocument[]) => void
  options: BlocklyOptions
}

const BlocklyComponent: React.FunctionComponent<Props> = ({
  workspaceXml,
  suggestions,
  setWorkspaceXml,
  setGherkinDocuments,
  options,
}) => {
  const toolbox = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="feature"/>
  <block type="rule"/>
  <block type="background"/>
  <block type="scenario"/>
  <block type="step"/>
  ${suggestions.map((suggestion) => `<block type="${suggestion.label}"/>`)}
</xml>
`
  const blocklyDiv = React.createRef<HTMLDivElement>()

  useEffect(() => {
    if (!blocklyDiv.current) return
    const workspace = Blockly.inject(blocklyDiv.current, { ...options, toolbox })

    // @ts-ignore
    workspace.addChangeListener((event) => {
      if ('name' in event && event.name === 'STEP_TEXT') {
        // no-op
      }

      // const xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace))
      // const blocks = workspace.getTopBlocks(true)
      // const gherkinDocuments = blocks.map((block) => toGherkinDocument(block))
      //
      // setWorkspaceXml(xml)
      // setGherkinDocuments(gherkinDocuments)
    })

    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspaceXml), workspace)

    return () => workspace.dispose()
  }, [blocklyDiv.current])

  return <div ref={blocklyDiv} id="blocklyDiv" />
}

export default BlocklyComponent

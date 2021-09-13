import 'blockly/blocks'

import { GherkinDocument } from '@cucumber/messages'
import { BlocklyOptions } from 'blockly/blockly'
import Blockly from 'blockly/core'
import locale from 'blockly/msg/en'
import React, { useEffect } from 'react'

import { toGherkinDocument } from './toGherkin'

Blockly.setLocale(locale)

type Props = {
  workspaceXml: string
  setWorkspaceXml: (xml: string) => void
  setGherkinDocuments: (gherkinDocument: readonly GherkinDocument[]) => void
  options: BlocklyOptions
}

const BlocklyComponent: React.FunctionComponent<Props> = ({
  workspaceXml,
  setWorkspaceXml,
  setGherkinDocuments,
  options,
}) => {
  const blocklyDiv = React.createRef<HTMLDivElement>()

  useEffect(() => {
    if (!blocklyDiv.current) return
    const workspace = Blockly.inject(blocklyDiv.current, options)

    workspace.addChangeListener(() => {
      const xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace))
      const blocks = workspace.getTopBlocks(true)
      const gherkinDocuments = blocks.map((block) => toGherkinDocument(block))

      setWorkspaceXml(xml)
      setGherkinDocuments(gherkinDocuments)
    })

    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspaceXml), workspace)

    return () => workspace.dispose()
  }, [blocklyDiv.current])

  return <div ref={blocklyDiv} id="blocklyDiv" />
}

export default BlocklyComponent

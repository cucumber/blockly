import 'blockly/blocks'

import { BlocklyOptions } from 'blockly/blockly'
import Blockly from 'blockly/core'
import locale from 'blockly/msg/en'
import React, { useEffect } from 'react'

Blockly.setLocale(locale)

type Props = {
  workspaceXml: string
  setWorkspaxeXml: (xml: string) => void
  options: BlocklyOptions
}

const BlocklyComponent: React.FunctionComponent<Props> = ({
  workspaceXml,
  setWorkspaxeXml,
  options,
}) => {
  const blocklyDiv = React.createRef<HTMLDivElement>()

  useEffect(() => {
    if (!blocklyDiv.current) return
    const workspace = Blockly.inject(blocklyDiv.current, options)

    workspace.addChangeListener(() => {
      const xml = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(workspace))
      setWorkspaxeXml(xml)
    })

    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspaceXml), workspace)

    return () => workspace.dispose()
  }, [blocklyDiv.current])

  return <div ref={blocklyDiv} id="blocklyDiv" />
}

export default BlocklyComponent

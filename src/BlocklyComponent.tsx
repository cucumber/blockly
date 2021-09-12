import React, { useEffect } from 'react'

import Blockly from 'blockly/core'
import locale from 'blockly/msg/en'
import 'blockly/blocks'
import { BlocklyOptions } from 'blockly/blockly'

Blockly.setLocale(locale)

type Props = {
  workspaceXml: string
  options: BlocklyOptions
}

const BlocklyComponent: React.FunctionComponent<Props> = ({ workspaceXml, options }) => {
  const blocklyDiv = React.createRef<HTMLDivElement>()

  useEffect(() => {
    if (!blocklyDiv.current) return
    const workspace = Blockly.inject(
      blocklyDiv.current,
      options,
    )

    Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(workspaceXml), workspace)

    return () => workspace.dispose()
  }, [blocklyDiv.current])

  return <div ref={blocklyDiv} id="blocklyDiv"/>
}

export default BlocklyComponent

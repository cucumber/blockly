import '../src/defineBlocks'

import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import BlocklyComponent from '../src/BlocklyComponent'

const toolbox = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="scenario"/>
  <block type="given"/>
  <block type="when"/>
  <block type="i_have__int__cukes_in_my__word_" />
</xml>
`

const App: React.FunctionComponent = () => {
  const [workspaceXml, setWorkspaxeXml] = useState(`
<xml>
  <block type="scenario" x="20" y="20" />
</xml>
`)

  return (
    <div className="flex-container">
      <div className="flex-child">
        <BlocklyComponent
          workspaceXml={workspaceXml}
          setWorkspaxeXml={setWorkspaxeXml}
          options={{
            readOnly: false,
            trashcan: true,
            media: 'media/',
            toolbox,
            move: {
              scrollbars: true,
              drag: true,
              wheel: true,
            },
          }}
        ></BlocklyComponent>
      </div>

      <div className="flex-child">
        <pre>{workspaceXml}</pre>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))

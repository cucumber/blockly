import '../src/defineBlocks.js'

import { pretty } from '@cucumber/gherkin-utils'
import { GherkinDocument } from '@cucumber/messages'
import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom'

import BlocklyComponent from '../src/BlocklyComponent'

const toolbox = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="scenario"/>
  <block type="given"/>
  <block type="when"/>
  <block type="i_have__int__cukes_in_my__word_" />
  <block type="i_check_if_i_am_hungry" />
</xml>
`

const App: React.FunctionComponent = () => {
  const [workspaceXml, setWorkspaceXml] = useState(`
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="scenario" id="1" x="20" y="20">
        <field name="SCENARIO_NAME">The one where...</field>
        <statement name="STEPS">
          <block type="given" id="2">
            <value name="NAME">
              <block type="i_have__int__cukes_in_my__word_" id="3">
                <field name="ARG1">42</field>
                <field name="ARG2">belly</field>
              </block>
            </value>
          </block>
        </statement>
      </block>
    </xml>
  `)
  const [gherkinDocuments, setGherkinDocuments] = useState<readonly GherkinDocument[]>([])

  const gherkinSource = useMemo(() => {
    return gherkinDocuments.map((gherkinDocument) => pretty(gherkinDocument)).join('\n')
  }, [gherkinDocuments])

  return (
    <div className="flex-container">
      <div className="flex-child">
        <BlocklyComponent
          workspaceXml={workspaceXml}
          setWorkspaceXml={setWorkspaceXml}
          setGherkinDocuments={setGherkinDocuments}
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
        />
      </div>

      <div className="flex-child">
        <pre className="border">{gherkinSource}</pre>
        <pre className="border">{workspaceXml}</pre>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))

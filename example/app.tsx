import {
  Expression,
  ExpressionFactory,
  ParameterTypeRegistry,
} from '@cucumber/cucumber-expressions'
import { pretty } from '@cucumber/gherkin-utils'
import { GherkinDocument } from '@cucumber/messages'
import { buildStepDocuments } from '@cucumber/suggest'
import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom'

import BlocklyComponent from '../src/BlocklyComponent'
import { defineBlocks } from '../src/defineBlocks.js'

const toolbox = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="scenario"/>
  <block type="step"/>
</xml>
`

// Build some sample step texts and cucumber expressions. These would typically come from a stream
// of Cucumber Messages.
const ef = new ExpressionFactory(new ParameterTypeRegistry())
const expressions: Expression[] = [
  ef.createExpression('I have {int} cukes in my belly'),
  ef.createExpression('there are {int} blind mice'),
]
const stepDocuments = buildStepDocuments(
  ['I have 42 cukes in my belly', 'I have 96 cukes in my belly', 'there are 38 blind mice'],
  expressions
)
defineBlocks(stepDocuments)

const App: React.FunctionComponent = () => {
  const [workspaceXml, setWorkspaceXml] = useState(`
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="scenario" id="H]D);F2kYo=xCdjp;[,}" x="78" y="-25">
        <field name="SCENARIO_NAME">The one where...</field>
        <statement name="STEPS">
          <block type="step" id="7n3=OA!N#Yx.cyUYC^y5">
            <field name="STEP_KEYWORD">GIVEN</field>
            <field name="STEP_TEXT">this is an undefined step</field>
            <next>
              <block type="_cucumber_0" id="/fSm?XET8tbqrFUS24WH">
                <field name="STEP_KEYWORD">WHEN</field>
                <field name="STEP_FIELD_1">I have </field>
                <field name="STEP_FIELD_2">8899</field>
                <field name="STEP_FIELD_3"> cukes in my belly</field>
              </block>
            </next>
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

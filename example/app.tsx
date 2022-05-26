import {
  Expression,
  ExpressionFactory,
  ParameterTypeRegistry,
} from '@cucumber/cucumber-expressions'
import { pretty } from '@cucumber/gherkin-utils'
import { buildSuggestions } from '@cucumber/language-service'
import { GherkinDocument } from '@cucumber/messages'
import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'

import BlocklyComponent from '../src/BlocklyComponent'
import { defineBlocks } from '../src/defineBlocks.js'

// Build some sample step texts and cucumber expressions. These would typically come from a stream
// of Cucumber Messages.
const registry = new ParameterTypeRegistry()
const ef = new ExpressionFactory(registry)
const expressions: Expression[] = [
  ef.createExpression('I have {int} cukes in my {word}'),
  ef.createExpression('there are {int} blind mice'),
]
const suggestions = buildSuggestions(
  registry,
  ['I have 42 cukes in my belly', 'I have 96 cukes in my belly', 'there are 38 blind mice'],
  expressions
)
defineBlocks(suggestions)

const App: React.FunctionComponent = () => {
  const [workspaceXml, setWorkspaceXml] = useState(`
    <xml xmlns="https://developers.google.com/blockly/xml">
<!--      <block type="scenario" id="0V5*@yYI7-3LDlQ~%cP." x="76" y="101">-->
<!--        <field name="SCENARIO_NAME">The one where...</field>-->
<!--        <statement name="STEPS">-->
<!--          <block type="I have {int} cukes in my {word}" id="f$CNPC;*bML~99P_\`prh">-->
<!--            <field name="STEP_KEYWORD">GIVEN</field>-->
<!--            <field name="STEP_FIELD_1">I have </field>-->
<!--            <field name="STEP_FIELD_2">38</field>-->
<!--            <field name="STEP_FIELD_3"> cukes in my belly</field>-->
<!--            <next>-->
<!--              <block type="there are {int} blind mice" id="@}nG:J{47KEaPV.uV2P\`">-->
<!--                <field name="STEP_KEYWORD">GIVEN</field>-->
<!--                <field name="STEP_FIELD_1">there are </field>-->
<!--                <field name="STEP_FIELD_2">38</field>-->
<!--                <field name="STEP_FIELD_3"> blind mice</field>-->
<!--                <next></next>-->
<!--              </block>-->
<!--            </next>-->
<!--          </block>-->
<!--        </statement>-->
<!--      </block>-->
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
          suggestions={suggestions}
          workspaceXml={workspaceXml}
          setWorkspaceXml={setWorkspaceXml}
          setGherkinDocuments={setGherkinDocuments}
          options={{
            readOnly: false,
            trashcan: true,
            media: 'media/',
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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<App />)

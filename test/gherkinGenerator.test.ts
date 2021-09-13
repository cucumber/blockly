import '../src/defineBlocks.js'

import Blockly from 'blockly'
import { describe, it } from 'mocha'
import assert from 'node:assert'

import { gherkinGenerator } from '../src/gherkinGenerator.js'

describe('gherkinGenerator', () => {
  it('generates code for scenario', () => {
    const xml = `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="scenario" id="l=cm)W@0;Ji)D.z3[For" x="20" y="20">
        <field name="SCENARIO_NAME">The one where...</field>
        <statement name="STEPS">
          <block type="given" id="+F]L^TE\`p4FgdmYmIej^">
            <value name="NAME">
              <block type="i_have__int__cukes_in_my__word_" id="N6R(eKU.,6L+!8+yk07F">
                <field name="ARG1">42</field>
                <field name="ARG2">belly</field>
              </block>
            </value>
          </block>
        </statement>
      </block>
    </xml>
    `
    const expectedCode = `Scenario: the one where...
Given I have 42 cukes in my belly
`
    assertCode(xml, expectedCode)
  })
})

function assertCode(xml: string, expectedCode: string) {
  const workspace = new Blockly.Workspace()
  const element = Blockly.Xml.textToDom(xml)
  Blockly.Xml.domToWorkspace(element, workspace)
  const code = gherkinGenerator.workspaceToCode(workspace)
  assert.strictEqual(code, expectedCode)
}

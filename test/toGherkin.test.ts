import '../src/defineBlocks.js'

import { pretty } from '@cucumber/gherkin-utils'
import Blockly from 'blockly'
import { describe, it } from 'mocha'
import assert from 'node:assert'

import { toGherkinDocument } from '../src/toGherkin.js'

describe('gherkinGenerator', () => {
  it('generates code for scenario', () => {
    const xml = `
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
              <next>
                <block type="when" id="$7}8ZMbTtwSD!=iyo{=|">
                  <value name="NAME">
                    <block type="i_check_if_i_am_hungry" id="kIC?@)]?M]b/[$[\`2Xt1"></block>
                  </value>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </xml>
    `
    const expectedCode = `Feature: TODO

  Scenario: The one where...
    Given I have 42 cukes in my belly
    When I check if I am hungry
`
    assertCode(xml, expectedCode)
  })
})

function assertCode(xml: string, expectedCode: string) {
  const workspace = new Blockly.Workspace()
  const element = Blockly.Xml.textToDom(xml)
  Blockly.Xml.domToWorkspace(element, workspace)
  const blocks = workspace.getTopBlocks(true)
  const code = blocks
    .map((block) => {
      const gherkinDocument = toGherkinDocument(block)
      return pretty(gherkinDocument)
    })
    .join('\n')
  assert.strictEqual(code, expectedCode)
}

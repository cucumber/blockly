import {
  Expression,
  ExpressionFactory,
  ParameterTypeRegistry,
} from '@cucumber/cucumber-expressions'
import { pretty } from '@cucumber/gherkin-utils'
import { buildSuggestions, parseGherkinDocument, Suggestion } from '@cucumber/language-service'
import { GherkinDocument } from '@cucumber/messages'
import Blockly from 'blockly'
import { describe, it } from 'mocha'
import assert from 'node:assert'
import formatXml from 'xml-formatter'

import { defineBlocks } from '../src/defineBlocks.js'
import { gherkinDocumentToBlocklyXml } from '../src/gherkinDocumentToBlocklyXml.js'
import { makeGenerator } from '../src/makeGenerator.js'

describe('codec', () => {
  let suggestions: readonly Suggestion[]

  beforeEach(() => {
    const registry = new ParameterTypeRegistry()
    const ef = new ExpressionFactory(registry)
    const expressions: Expression[] = [
      ef.createExpression('I have {int} cukes in my belly'),
      ef.createExpression('there are {int} blind mice'),
    ]
    suggestions = buildSuggestions(
      registry,
      ['I have 42 cukes in my belly', 'I have 96 cukes in my belly', 'there are 38 blind mice'],
      expressions
    )
    defineBlocks(suggestions)
  })

  it('roundtrips two empty scenarios', () => {
    const xml = `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="feature" id="Ac|u]rJ6HOG;W@^7@w?A" x="70" y="36">
          <field name="NAME">F</field>
          <statement name="CHILDREN">
            <block type="scenario" id="uauY^\`5[Xm+/SND.h1]E">
              <field name="NAME">1</field>
              <next>
                <block type="scenario" id="I?+=Ap\`W0SDlk3r4V2m7">
                  <field name="NAME">2</field>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </xml>
    `
    const expectedCode = `Feature: F
Scenario: 1
Scenario: 2
`
    assertRoundtrip(xml, expectedCode, suggestions)
  })

  it('roundtrips feature/rule/scenario/step', () => {
    const xml = `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="feature" id="Z(Gdr1//yqw?@cnLgG#?" x="19" y="-149">
          <field name="NAME">P</field>
          <statement name="CHILDREN">
            <block type="rule" id="cb;FSoS}S({=DO|ygIHO">
              <field name="NAME">Q</field>
              <statement name="CHILDREN">
                <block type="scenario" id="RF6%Z/?AK7e@F#Rw==W*">
                  <field name="NAME">R</field>
                  <statement name="STEPS">
                    <block type="step" id="S$*7^Y8prMJbo^w$iC)H">
                      <field name="KEYWORD">Given</field>
                      <field name="TEXT">S</field>
                    </block>
                  </statement>
                </block>
              </statement>
            </block>
          </statement>
        </block>
      </xml>
    `
    const expectedCode = `
      Feature: P
        Rule: Q
          Scenario: R
            Given S
`
    assertRoundtrip(xml, expectedCode, suggestions)
  })

  it('roundtrips a background with a step', () => {
    const xml = `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="feature" id="1djWV{Vf!h]pVrqrx{6!" x="37" y="42">
          <field name="NAME">N</field>
          <statement name="CHILDREN">
            <block type="background" id="/{cayBTaM{L-?8/arI?t">
              <field name="NAME">O</field>
              <statement name="STEPS">
                <block type="step" id="^t4i3fBRS|9xxr;;2Iq6">
                  <field name="KEYWORD">Given</field>
                  <field name="TEXT">P</field>
                </block>
              </statement>
            </block>
          </statement>
        </block>
      </xml>
    `
    const expectedCode = `
      Feature: N
      
        Background: O
          Given P
    `
    assertRoundtrip(xml, expectedCode, suggestions)
  })

  it('roundtrips a two scenarios with two steps', () => {
    const xml = `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="feature" id="uzkuY++o)BVr4Bf^o)cp" x="45" y="17">
          <field name="NAME">A</field>
          <statement name="CHILDREN">
            <block type="scenario" id="FG$LS]#eQ._:YxWuFIS.">
              <field name="NAME">B</field>
              <statement name="STEPS">
                <block type="step" id="!+$IZnJ26R/#W3Ptal;s">
                  <field name="KEYWORD">Given</field>
                  <field name="TEXT">C</field>
                  <next>
                    <block type="step" id="4)7xn:Vf1H[DI(S@d?~b">
                      <field name="KEYWORD">Given</field>
                      <field name="TEXT">D</field>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="scenario" id="Vvni@XgF3q?pa7_QrJc1">
                  <field name="NAME">E</field>
                  <statement name="STEPS">
                    <block type="step" id="Vs5vfODMoMV;b^xXfSp#">
                      <field name="KEYWORD">Given</field>
                      <field name="TEXT">F</field>
                      <next>
                        <block type="step" id="!J50%N-l+VCBjg]pawS4">
                          <field name="KEYWORD">Given</field>
                          <field name="TEXT">G</field>
                        </block>
                      </next>
                    </block>
                  </statement>
                  <next />
                </block>
              </next>
            </block>
          </statement>
        </block>
      </xml>
    `
    const expectedCode = `
      Feature: A
      
        Scenario: B
          Given C
          Given D
      
        Scenario: E
          Given F
          Given G
    `
    assertRoundtrip(xml, expectedCode, suggestions)
  })

  it('roundtrips a background and a scenario', () => {
    const xml = `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="feature" id="1djWV{Vf!h]pVrqrx{6!" x="37" y="42">
          <field name="NAME">N</field>
          <statement name="CHILDREN">
            <block type="background" id="/{cayBTaM{L-?8/arI?t">
              <field name="NAME">O</field>
              <statement name="STEPS">
                <block type="step" id="^t4i3fBRS|9xxr;;2Iq6">
                  <field name="KEYWORD">Given</field>
                  <field name="TEXT">P</field>
                </block>
              </statement>
              <next>
                <block type="scenario" id="PSj2b(6kov4@?L;TcK[f">
                  <field name="NAME">Q</field>
                  <statement name="STEPS">
                    <block type="step" id=",(;C4YbrJmv;UEc^*BbD">
                      <field name="KEYWORD">Given</field>
                      <field name="TEXT">R</field>
                    </block>
                  </statement>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </xml>
    `
    const expectedCode = `
      Feature: N
      
        Background: O
          Given P
      
        Scenario: Q
          Given R
    `
    assertRoundtrip(xml, expectedCode, suggestions)
  })

  it('roundtrips a scenario followed by a rule', () => {
    const xml = `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="feature" id="1djWV{Vf!h]pVrqrx{6!" x="37" y="42">
          <field name="NAME">N</field>
          <statement name="CHILDREN">
            <block type="scenario" id="PSj2b(6kov4@?L;TcK[f">
              <field name="NAME">O</field>
              <statement name="STEPS">
                <block type="step" id=",(;C4YbrJmv;UEc^*BbD">
                  <field name="KEYWORD">Given</field>
                  <field name="TEXT">P</field>
                </block>
              </statement>
              <next>
                <block type="rule" id="Jxej?w{NL49K|jtmPc:S">
                  <field name="NAME">Q</field>
                  <statement name="CHILDREN">
                    <block type="scenario" id="fxOY{yK#%$3ky\`C}.s90">
                      <field name="NAME">R</field>
                      <statement name="STEPS">
                        <block type="step" id="^t4i3fBRS|9xxr;;2Iq6">
                          <field name="KEYWORD">Given</field>
                          <field name="TEXT">S</field>
                        </block>
                      </statement>
                    </block>
                  </statement>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </xml>
    `
    const expectedCode = `
      Feature: N
      
        Scenario: O
          Given P
      
        Rule: Q
      
          Scenario: R
            Given S
    `
    assertRoundtrip(xml, expectedCode, suggestions)
  })

  it('roundtrips a complex scenario', () => {
    const xml = `
      <xml xmlns="https://developers.google.com/blockly/xml">
        <block type="feature" id="uzkuY++o)BVr4Bf^o)cp" x="45" y="17">
          <field name="NAME">A</field>
          <statement name="CHILDREN">
            <block type="background" id="0ORi5.*U8yEgH~H38,ND">
              <field name="NAME">B</field>
              <statement name="STEPS">
                <block type="step" id="!+$IZnJ26R/#W3Ptal;s">
                  <field name="KEYWORD">Given</field>
                  <field name="TEXT">C</field>
                  <next>
                    <block type="step" id="4)7xn:Vf1H[DI(S@d?~b">
                      <field name="KEYWORD">Given</field>
                      <field name="TEXT">D</field>
                    </block>
                  </next>
                </block>
              </statement>
              <next>
                <block type="scenario" id="Vvni@XgF3q?pa7_QrJc1">
                  <field name="NAME">E</field>
                  <statement name="STEPS">
                    <block type="step" id="Vs5vfODMoMV;b^xXfSp#">
                      <field name="KEYWORD">Given</field>
                      <field name="TEXT">F</field>
                      <next>
                        <block type="step" id="!J50%N-l+VCBjg]pawS4">
                          <field name="KEYWORD">Given</field>
                          <field name="TEXT">G</field>
                        </block>
                      </next>
                    </block>
                  </statement>
                  <next>
                    <block type="rule" id="cb;FSoS}S({=DO|ygIHO">
                      <field name="NAME">H</field>
                      <statement name="CHILDREN">
                        <block type="background" id="=!2xqbS0bk!o8~ev:wH5">
                          <field name="NAME">I</field>
                          <statement name="STEPS">
                            <block type="step" id="$jniCM6nKKKmWo*{:Af]">
                              <field name="KEYWORD">Given</field>
                              <field name="TEXT">J</field>
                              <next>
                                <block type="step" id="OmPUT:gC=8{F,@eTh}0b">
                                  <field name="KEYWORD">Given</field>
                                  <field name="TEXT">K</field>
                                </block>
                              </next>
                            </block>
                          </statement>
                          <next>
                            <block type="scenario" id=":W9@SEZ~XT5;sdteHljA">
                              <field name="NAME">L</field>
                              <statement name="STEPS">
                                <block type="step" id="$!QwxI*-/)1[*TfMD=SN">
                                  <field name="KEYWORD">Given</field>
                                  <field name="TEXT">M</field>
                                  <next>
                                    <block type="step" id="K/YtpMdarVIb81-SgpzN">
                                      <field name="KEYWORD">Given</field>
                                      <field name="TEXT">N</field>
                                    </block>
                                  </next>
                                </block>
                              </statement>
                            </block>
                          </next>
                        </block>
                      </statement>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </xml>
    `
    const expectedCode = `Feature: A

  Background: B
    Given C
    Given D

  Scenario: E
    Given F
    Given G

  Rule: H

    Background: I
      Given J
      Given K

    Scenario: L
      Given M
      Given N
`
    assertRoundtrip(xml, expectedCode, suggestions)
  })
})

function assertRoundtrip(xml: string, expectedCode: string, suggestions: readonly Suggestion[]) {
  const generator = makeGenerator(suggestions)
  let element: Element
  try {
    element = Blockly.Xml.textToDom(xml)
  } catch (err) {
    err.message += xml
    throw err
  }
  const gherkinDocument = assertCode(element, generator, expectedCode)
  // Now verify that the GherkinDocument can be turned into XML, loaded into workspace and out, and back to Gherkin again

  const xmlDocument = Blockly.utils.xml.textToDomDocument(
    `<xml xmlns="${Blockly.utils.xml.NAME_SPACE}"></xml>`
  )
  Blockly.utils.xml.setDocument(xmlDocument)
  const doc = Blockly.utils.xml.getDocument()
  const xmlElement = doc.documentElement

  gherkinDocumentToBlocklyXml(gherkinDocument, xmlElement)
  assertCode(xmlElement, generator, expectedCode)
}

function assertCode(
  element: Element,
  generator: Blockly.Generator,
  expectedCode: string
): GherkinDocument {
  const workspace = new Blockly.Workspace()
  if (process.env.PRINT_XML) {
    console.log(formatXml(element.outerHTML, { collapseContent: true, indentation: '  ' }))
  }
  try {
    Blockly.Xml.domToWorkspace(element, workspace)
    // const blocks = workspace.getTopBlocks(true)
    // assert.strictEqual(blocks.length, 1)
    const generatedCode = generator.workspaceToCode(workspace)
    // console.log(generatedCode)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const gherkinDocument = parseGherkinDocument(generatedCode).gherkinDocument!
    assert.strictEqual(
      pretty(gherkinDocument),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      pretty(parseGherkinDocument(expectedCode).gherkinDocument!)
    )
    return gherkinDocument
  } finally {
    workspace.dispose()
  }
}

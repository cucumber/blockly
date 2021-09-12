import React from 'react'
import ReactDOM from 'react-dom'
import BlocklyComponent from '../src/BlocklyComponent'

const toolbox = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="controls_ifelse"/>
  <block type="logic_compare"/>
  <block type="logic_operation"/>
  <block type="controls_repeat_ext">
    <value name="TIMES">
      <Shadow type="math_number">
        <field name="NUM">10</field>
      </Shadow>
    </value>
  </block>
  <block type="logic_operation"/>
  <block type="logic_negate"/>
  <block type="logic_boolean"/>
  <block type="logic_null" disabled="true"/>
  <block type="logic_ternary"/>
  <block type="text_charAt">
    <value name="VALUE">
      <block type="variables_get">
        <field name="VAR">text</field>
      </block>
    </value>
  </block>
</xml>
`

const App: React.FunctionComponent = () => {
  const workspaceXml = `
<xml xmlns="http://www.w3.org/1999/xhtml">
<block type="controls_ifelse" x="0" y="0"></block>
</xml>
`

  return <BlocklyComponent
    workspaceXml={workspaceXml}
    options={{
      readOnly: false,
      trashcan: true,
      media: 'media/',
      toolbox,
      move: {
        scrollbars: true,
        drag: true,
        wheel: true
      }
    }}>
  </BlocklyComponent>
}

ReactDOM.render(<App/>, document.getElementById('app'))

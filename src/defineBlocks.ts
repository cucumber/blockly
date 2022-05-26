import { Suggestion } from '@cucumber/language-service'
import Blockly from 'blockly'

export function defineBlocks(suggestions: readonly Suggestion[]) {
  Blockly.Blocks['feature'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Feature:')
        .appendField(new Blockly.FieldTextInput('Something amazing...'), 'FEATURE_NAME')
      this.appendStatementInput('CHILDREN').setCheck(['BACKGROUND', 'RULE', 'SCENARIO'])
      this.setColour(235)
      this.setTooltip('')
      this.setHelpUrl('')
    },
  }

  Blockly.Blocks['rule'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Rule:')
        .appendField(new Blockly.FieldTextInput('Only...'), 'RULE_NAME')
      this.appendStatementInput('CHILDREN').setCheck(['BACKGROUND', 'SCENARIO'])
      this.setPreviousStatement(true, 'RULE')
      this.setNextStatement(true, ['RULE', 'SCENARIO'])
      this.setColour(35)
      this.setTooltip('')
      this.setHelpUrl('')
    },
  }

  Blockly.Blocks['background'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Background:')
        .appendField(new Blockly.FieldTextInput('Always...'), 'BACKGROUND_NAME')
      this.appendStatementInput('STEPS').setCheck('STEP')
      this.setPreviousStatement(true, 'BACKGROUND')
      this.setNextStatement(true, ['RULE', 'SCENARIO'])
      this.setColour(0)
      this.setTooltip('')
      this.setHelpUrl('')
    },
  }

  Blockly.Blocks['scenario'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Scenario:')
        .appendField(new Blockly.FieldTextInput('The one where...'), 'SCENARIO_NAME')
      this.appendStatementInput('STEPS').setCheck('STEP')
      this.setPreviousStatement(true, 'SCENARIO')
      this.setNextStatement(true, 'SCENARIO')
      this.setColour(135)
      this.setTooltip('')
      this.setHelpUrl('')
    },
  }

  Blockly.Blocks['step'] = {
    init: function (this: Blockly.Block) {
      const dummyInput = this.appendDummyInput()
      dummyInput.appendField(
        new Blockly.FieldDropdown([
          ['Given', 'GIVEN'],
          ['When', 'WHEN'],
          ['Then', 'THEN'],
        ]),
        'STEP_KEYWORD'
      )
      dummyInput.appendField(new Blockly.FieldTextInput(''), `STEP_TEXT`)

      this.setPreviousStatement(true, 'STEP')
      this.setNextStatement(true, 'STEP')
      this.setColour(300)
      this.setTooltip('generic step')
      this.setHelpUrl('')
    },
  }

  for (const suggestion of suggestions) {
    Blockly.Blocks[suggestion.label] = {
      init: function (this: Blockly.Block) {
        const dummyInput = this.appendDummyInput()
        dummyInput.appendField(
          new Blockly.FieldDropdown([
            ['Given', 'GIVEN'],
            ['When', 'WHEN'],
            ['Then', 'THEN'],
          ]),
          'STEP_KEYWORD'
        )
        let i = 1
        for (const segment of suggestion.segments) {
          if (typeof segment === 'string') {
            dummyInput.appendField(new Blockly.FieldLabelSerializable(segment), `STEP_FIELD_${i++}`)
          } else {
            dummyInput.appendField(new Blockly.FieldTextInput(segment[0]), `STEP_FIELD_${i++}`)
          }
        }

        this.setPreviousStatement(true, 'STEP')
        this.setNextStatement(true, 'STEP')
        this.setColour(270)
        this.setTooltip(suggestion.label)
        this.setHelpUrl('')
      },
    }
  }
}

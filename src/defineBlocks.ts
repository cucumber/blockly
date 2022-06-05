import { Suggestion } from '@cucumber/language-service'
import Blockly from 'blockly'

export function defineBlocks(suggestions: readonly Suggestion[]) {
  Blockly.Blocks['feature'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Feature')
        .appendField(new Blockly.FieldTextInput('Something amazing...'), 'NAME')
      this.appendStatementInput('CHILDREN').setCheck(['background', 'rule', 'scenario'])
      this.setColour(235)
      this.setTooltip('')
      this.setHelpUrl('')
    },
  }

  Blockly.Blocks['scenario'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Scenario')
        .appendField(new Blockly.FieldTextInput('The one where...'), 'NAME')
      this.appendStatementInput('STEPS').setCheck('step')
      this.setPreviousStatement(true, 'scenario')
      this.setNextStatement(true, ['rule', 'scenario'])
      this.setColour(135)
      this.setTooltip('')
      this.setHelpUrl('')
    },
  }

  Blockly.Blocks['rule'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Rule')
        .appendField(new Blockly.FieldTextInput('Only...'), 'NAME')
      this.appendStatementInput('CHILDREN').setCheck(['background', 'scenario'])
      this.setPreviousStatement(true, 'rule')
      this.setNextStatement(true, ['rule'])
      this.setColour(35)
      this.setTooltip('')
      this.setHelpUrl('')
    },
  }

  Blockly.Blocks['background'] = {
    init: function (this: Blockly.Block) {
      this.appendDummyInput()
        .appendField('Background')
        .appendField(new Blockly.FieldTextInput('Always...'), 'NAME')
      this.appendStatementInput('STEPS').setCheck('step')
      this.setPreviousStatement(true, 'background')
      this.setNextStatement(true, ['rule', 'scenario'])
      this.setColour(0)
      this.setTooltip('')
      this.setHelpUrl('')
    },
  }

  Blockly.Blocks['step'] = {
    init: function (this: Blockly.Block) {
      const dummyInput = this.appendDummyInput()
      dummyInput.appendField(
        new Blockly.FieldDropdown([
          ['Given', 'Given'],
          ['When', 'When'],
          ['Then', 'Then'],
        ]),
        'KEYWORD'
      )
      dummyInput.appendField(new Blockly.FieldTextInput('...'), `TEXT`)

      this.setPreviousStatement(true, 'step')
      this.setNextStatement(true, 'step')
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
            ['Given', 'Given'],
            ['When', 'When'],
            ['Then', 'Then'],
          ]),
          'KEYWORD'
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

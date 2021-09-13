import Blockly from 'blockly'

Blockly.Blocks['scenario'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput()
      .appendField('Scenario:')
      .appendField(new Blockly.FieldTextInput('The one where...'), 'SCENARIO_NAME')
    this.appendStatementInput('STEPS').setCheck('STEP_KEYWORD')
    this.setColour(135)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}

Blockly.Blocks['given'] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('NAME').setCheck('STEP_TEXT').appendField('Given')
    this.setPreviousStatement(true, 'STEP_KEYWORD')
    this.setNextStatement(true, 'STEP_KEYWORD')
    this.setColour(270)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}

Blockly.Blocks['when'] = {
  init: function (this: Blockly.Block) {
    this.appendValueInput('NAME').setCheck('STEP_TEXT').appendField('When')
    this.setPreviousStatement(true, 'STEP_KEYWORD')
    this.setNextStatement(true, 'STEP_KEYWORD')
    this.setColour(270)
    this.setTooltip('')
    this.setHelpUrl('')
  },
}

Blockly.Blocks['i_have__int__cukes_in_my__word_'] = {
  init: function (this: Blockly.Block) {
    // TODO: Remove the leading/trailing spaces in label fields and use a custom "hidden" field for spaces instead.
    // https://developers.google.com/blockly/guides/create-custom-blocks/fields/customizing-fields/creating
    // This way we can avoid having the leading/trailing spaces rendered - it's currently a bit too "spacey"
    this.appendDummyInput()
      .appendField('I have ')
      .appendField(new Blockly.FieldNumber(42), 'ARG1')
      .appendField(' cukes in my ')
      .appendField(new Blockly.FieldTextInput('belly'), 'ARG2')
    this.setOutput(true, 'STEP_TEXT')
    this.setColour(180)
    this.setTooltip('I have {int} cukes in my {word}')
    this.setHelpUrl('')
  },
}

Blockly.Blocks['i_check_if_i_am_hungry'] = {
  init: function (this: Blockly.Block) {
    this.appendDummyInput().appendField('I check if I am hungry')
    this.setOutput(true, 'STEP_TEXT')
    this.setColour(180)
    this.setTooltip('I check if I am hungry')
    this.setHelpUrl('')
  },
}

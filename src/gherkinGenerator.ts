import blockly from 'blockly'

export const gherkinGenerator = new blockly.Generator('Cucumber')

// @ts-ignore
gherkinGenerator['scenario'] = (block: Block) => {
  return `Scenario: ${block.getFieldValue('SCENARIO_NAME')}\n`
}

// @ts-ignore
gherkinGenerator['given'] = () => {
  return 'Given '
}

// @ts-ignore
gherkinGenerator['when'] = () => {
  return 'When '
}

// @ts-ignore
gherkinGenerator['i_have__int__cukes_in_my__word_'] = () => {
  return 'I have some cukes...'
}

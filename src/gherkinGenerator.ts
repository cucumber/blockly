import { Block, Generator } from 'blockly'

const generator = new Generator('Cucumber')

// @ts-ignore
generator['scenario'] = (block: Block) => {
  return `Scenario: ${block.getFieldValue('SCENARIO_NAME')}\n`
}

// @ts-ignore
generator['given'] = () => {
  return 'Given '
}

// @ts-ignore
generator['when'] = () => {
  return 'When '
}

// @ts-ignore
generator['i_have__int__cukes_in_my__word_'] = () => {
  return 'I have some cukes...'
}

export default generator

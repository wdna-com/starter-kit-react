import getRoundedPi from '../helpers/Math';

const { expect } = require('chai');

describe('Math Helper Tests', () => {
  it('Should return rounded PI', (done) => {
    const output = getRoundedPi();
    const expected = 3;

    expect(output).to.equal(expected);
    done();
  });
});

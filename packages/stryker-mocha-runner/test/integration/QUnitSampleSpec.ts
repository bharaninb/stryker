import * as path from 'path';
import { expect } from 'chai';
import { RunStatus } from 'stryker-api/test_runner';
import MochaTestRunner from '../../src/MochaTestRunner';
import { runnerOptions } from '../helpers/mockHelpers';

describe('QUnit sample', () => {

  it('should work when configured with "qunit" ui', async () => {
    const mochaOptions = {
      files: [resolve('./testResources/qunit-sample/MyMathSpec.js')],
      require: [],
      ui: 'qunit'
    };
    const sut = new MochaTestRunner(runnerOptions({
      config: mochaOptions,
      fileNames: mochaOptions.files,
    }));
    await sut.init();
    const actualResult = await sut.run({});
    expect(actualResult.status).eq(RunStatus.Complete);
    expect(actualResult.tests.map(t => t.name)).deep.eq([
      'Math should be able to add two numbers',
      'Math should be able 1 to a number',
      'Math should be able negate a number',
      'Math should be able to recognize a negative number',
      'Math should be able to recognize that 0 is not a negative number'
    ]);
  });

  it('should not run tests when not configured with "qunit" ui', async () => {
    const sut = new MochaTestRunner({
      config: {
        files: [
          resolve('./testResources/qunit-sample/MyMathSpec.js')
        ]
      },
      fileNames: [
        resolve('./testResources/qunit-sample/MyMathSpec.js'),
        resolve('./testResources/qunit-sample/MyMath.js')
      ],
      port: 0,
      strykerOptions: {}
    });
    await sut.init();
    const actualResult = await sut.run({});
    expect(actualResult.status).eq(RunStatus.Complete);
    expect(actualResult.tests).lengthOf(0);
  });
});

function resolve(fileName: string) {
  return path.resolve(__dirname, '..', '..', fileName);
}

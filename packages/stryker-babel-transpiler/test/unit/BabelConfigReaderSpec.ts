import BabelConfigReader from '../../src/BabelConfigReader';
import { Config } from 'stryker-api/config';
import { expect } from 'chai';
import * as fs from 'fs';
import * as logging from 'stryker-api/logging';
import * as sinon from 'sinon';
import * as path from 'path';

describe('BabelConfigReader', () => {
  let sandbox: sinon.SinonSandbox;
  let logStub: {
    trace: sinon.SinonStub,
    info: sinon.SinonStub,
    error: sinon.SinonStub,
    debug: sinon.SinonStub
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    logStub = {
      debug: sandbox.stub(),
      error: sandbox.stub(),
      info: sandbox.stub(),
      trace: sandbox.stub()
    };

    sandbox.stub(logging, 'getLogger').returns(logStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should not read the .babelrc file from disk if the babelConfig property is present', () => {
    const editor = new BabelConfigReader();
    const babelConfig = { presets: ['env'] };
    const config = new Config();
    config.set({ babelConfig });

    const result = editor.readConfig(config);

    expect(result).eq(babelConfig);
  });

  describe('babelrcFile property present', () => {
    it('should read the .babelrc file from disk', () => {
      const editor = new BabelConfigReader();
      const config = new Config();
      config.set({ babelrcFile: '.babelrc' });
      const babelConfig = { presets: ['env'] };
      sandbox.stub(fs, 'existsSync').returns(true);
      sandbox.stub(fs, 'readFileSync').withArgs(path.resolve(config.babelrcFile), 'utf8').returns(JSON.stringify(babelConfig));

      const result = editor.readConfig(config);

      expect(result).deep.eq(babelConfig);
    });

    it('should log the path to the babelrc file', () => {

      const editor = new BabelConfigReader();
      const config = new Config();
      config.set({ babelrcFile: '.babelrc' });

      editor.readConfig(config);

      expect(logStub.info).calledWith(`Reading .babelrc file from path "${path.resolve(config.babelrcFile)}"`);
    });

    it('should log the babel config if read from an babelrc file', () => {
      const editor = new BabelConfigReader();
      const config = new Config();
      config.set({ babelrcFile: '.babelrc' });
      sandbox.stub(fs, 'readFileSync').returns('{ "presets": ["env"] }');
      sandbox.stub(fs, 'existsSync').returns(true);
      editor.readConfig(config);

      expect(logStub.debug).calledWith(`babel config is: ${JSON.stringify({ presets: ['env']}, null, 2)}`);
    });

    describe('when reading the file throws an error', () => {
      it('should log the error', () => {
        const editor = new BabelConfigReader();
        const config = new Config();
        config.set({ babelrcFile: '.nonExistingBabelrc' });

        editor.readConfig(config);

        expect(logStub.error).calledWith(`babelrc file does not exist at: ${path.resolve(config.babelrcFile)}`);
      });

      it('should set the babelConfig to an empty object', () => {
        const editor = new BabelConfigReader();
        const config = new Config();
        config.set({ babelrcFile: '.nonExistingBabelrc' });

        const result = editor.readConfig(config);

        expect(result).to.deep.equal({});
      });
    });
  });

  describe('babelrcFile property is not present', () => {
    it('should log a warning', () => {
      const editor = new BabelConfigReader();
      const config = new Config();
      const configKeyFile = 'babelrcFile';

      editor.readConfig(config);

      expect(logStub.info).calledWith(`No .babelrc file configured. Please set the "${configKeyFile}" property in your config.`);
    });

    it('should set the babelConfig to an empty object', () => {
      const editor = new BabelConfigReader();
      const config = new Config();

      const result = editor.readConfig(config);

      expect(result).to.deep.equal({});
    });
  });
});

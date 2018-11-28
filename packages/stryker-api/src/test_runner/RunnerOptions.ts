import { StrykerOptions } from '../../core';

/**
 * Represents an options object to configure a TestRunner.
 */
interface RunnerOptions {

  /**
   * The names of the files loaded in the sandbox.
   */
  fileNames?: string[];

  /**
   * Represents a free port which the test runner can choose to use
   */
  port: number;

  /**
   * Specify the maximum number of concurrent test runners. Useful if you don't want to use
   * all the CPU cores of your machine. Default: infinity, Stryker will decide for you and tries to use
   * all CPUs in your machine optimally.
   */
  maxConcurrentRunners: number;

  /**
   * TODO: Deprecate
   * The underlying strykerOptions
   */
  strykerOptions?: StrykerOptions;

  /**
   * TODO: Add comment
   */
  config: {
    [customConfig: string]: any;
  };
}

export default RunnerOptions;

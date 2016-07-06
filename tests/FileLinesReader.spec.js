/* global FileLinesReader:false */

describe('FileLinesReader', () => {
  it('should read specified number of lines', () => {
    const testFile = new Blob(['one\ntwo\nthree\n']);
    const reader = new FileLinesReader(testFile);
    return expect(reader.readLines(2))
      .to.eventually.deep.equal(['one', 'two']);
  });

  it('should not read more lines than are in the file', () => {
    const testFile = new Blob(['one\ntwo\nthree\n']);
    const reader = new FileLinesReader(testFile);
    return expect(reader.readLines(6))
      .to.eventually.deep.equal(['one', 'two', 'three', '']);
  });

  it('should handle files without trailing newlines', () => {
    const testFile = new Blob(['one\ntwo\nthree']);
    const reader = new FileLinesReader(testFile);
    return expect(reader.readLines(5))
      .to.eventually.deep.equal(['one', 'two', 'three']);
  });

  it('should handle files with blank lines', () => {
    const testFile = new Blob(['one\n\n\ntwo\n\nthree\n']);
    const reader = new FileLinesReader(testFile);
    return expect(reader.readLines(7))
      .to.eventually.deep.equal(['one', '', '', 'two', '', 'three', '']);
  });

  it('should handle having to read multiple slices', () => {
    const testFile = new Blob(['one\n\n\ntwo\n\nthree\n']);
    const reader = new FileLinesReader(testFile, 4);
    return expect(reader.readLines(7))
      .to.eventually.deep.equal(['one', '', '', 'two', '', 'three', '']);
  });

  it('should maintain place across sequential multiple reads', () => {
    const testFile = new Blob(['one\ntwo\nthree\nfour\nfive\nsix\n']);
    const reader = new FileLinesReader(testFile);
    return expect(reader.readLines(3))
      .to.eventually.deep.equal(['one', 'two', 'three'])
      .then(() => expect(reader.readLines(3))
          .to.eventually.deep.equal(['four', 'five', 'six']));
  });

  it('should correctly order results from multiple "concurrent" reads', () => {
    const testFile = new Blob(['one\ntwo\nthree\nfour\nfive\nsix\n']);
    const reader = new FileLinesReader(testFile, 3);
    return Promise.all([
      expect(reader.readLines(3))
        .to.eventually.deep.equal(['one', 'two', 'three']),
      expect(reader.readLines(3))
        .to.eventually.deep.equal(['four', 'five', 'six']),
    ]);
  });
});

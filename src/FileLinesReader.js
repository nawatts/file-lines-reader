function FileLinesReader(file, sliceSize = 1024) {
  this.file = file;

  this.sliceSize = sliceSize;
  this.slicePosition = 0;
  this.bufferedLines = [];
  this.prependToNextSlice = '';
}

FileLinesReader.prototype.loadNextSlice = function () {
  const slice = this.file.slice(this.slicePosition, this.slicePosition + this.sliceSize);
  this.slicePosition += slice.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const sliceText = this.prependToNextSlice.concat(e.target.result);
      this.bufferedLines = this.bufferedLines.concat(sliceText.split('\n'));

      // If this isn't the last slice, the last buffered line may not be a complete line.
      // This will happen if the slice doesn't end on a new line (probably most cases)
      if (!this.isOnLastSlice()) {
        this.prependToNextSlice = this.bufferedLines.pop();
      }

      resolve();
    };
    reader.onerror = (e) => reject(e);
    reader.readAsText(slice);
  });
};

FileLinesReader.prototype.isOnLastSlice = function () {
  return this.slicePosition >= this.file.size;
};

FileLinesReader.prototype.readLinesHelper = function (numLines) {
  if (numLines <= this.bufferedLines.length || this.isOnLastSlice()) {
    const lines = this.bufferedLines.slice(0, numLines);
    this.bufferedLines = this.bufferedLines.slice(numLines);
    return Promise.resolve(lines);
  }

  return this.loadNextSlice().then(() => this.readLinesHelper(numLines));
};

FileLinesReader.prototype.readLines = function (numLines = 1) {
  if (this.readInProgress) {
    this.readInProgress = this.readInProgress.then(() => this.readLinesHelper(numLines));
  } else {
    this.readInProgress = this.readLinesHelper(numLines);
  }
  return this.readInProgress;
};

export default FileLinesReader;

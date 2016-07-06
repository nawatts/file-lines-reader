class FileLinesReader {

  constructor(file, sliceSize = 1024) {
    this.file = file;

    this.sliceSize = sliceSize;
    this.slicePosition = 0;
    this.bufferedLines = [];
    this.prependToNextSlice = '';
  }

  loadNextSlice() {
    const slice = this.file.slice(this.slicePosition, this.slicePosition + this.sliceSize);
    this.slicePosition += slice.size;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const sliceText = this.prependToNextSlice.concat(e.target.result);
        this.bufferedLines = sliceText.split('\n');

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
  }

  isOnLastSlice() {
    return this.slicePosition >= this.file.size;
  }

  async readLinesHelper(numLines) {
    let lines = [];
    let remainingLines = numLines;
    while (remainingLines > this.bufferedLines.length) {
      lines = lines.concat(this.bufferedLines);
      remainingLines -= this.bufferedLines.length;
      this.bufferedLines = [];

      if (this.isOnLastSlice()) {
        return lines;
      }

      await this.loadNextSlice();
    }
    lines = lines.concat(this.bufferedLines.slice(0, remainingLines));
    this.bufferedLines = this.bufferedLines.slice(remainingLines);
    return lines;
  }

  async readLines(numLines = 1) {
    if (this.readInProgress) {
      await this.readInProgress;
    }
    this.readInProgress = this.readLinesHelper(numLines);
    return this.readInProgress;
  }

}

export default FileLinesReader;

# file-lines-reader

Read some lines from a file.

[FileReader](https://developer.mozilla.org/en-US/docs/Web/API/FileReader) reads all file content at once. This
slices a file into smaller chunks and reads one at a time until the desired number of lines are found.


```JavaScript
var reader = new FileLinesReader(/* File or Blob */ file);

reader.readLines(3).then(function(lines) {
  console.log(lines); // ["line1", "line2", "line3"]
});

reader.readLines(1).then(function(lines) {
  console.log(lines); // ["line4"]
});
```

const fs = require('fs');

// Read the input JSON file
const inputData = fs.readFileSync('heartrate.json', 'utf8');
const heartRateData = JSON.parse(inputData);

// Function to calculate the median of an array
function calculateMedian(arr) {
  const sortedArr = arr.sort((a, b) => a - b);
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 === 0 ? (sortedArr[mid - 1] + sortedArr[mid]) / 2 : sortedArr[mid];
}

// Process the heart rate data
const output = [];
for (const entry of heartRateData) {
  // Extract the date from the start timestamp
  const date = entry.timestamps.startTime.slice(0, 10);

  // Find existing entry for the date or create a new one
  let dayEntry = output.find((e) => e.date === date);
  if (!dayEntry) {
    dayEntry = { date, min: Infinity, max: -Infinity, beatsPerMinute: [], latestDataTimestamp: '' };
    output.push(dayEntry);
  }

  // Update min and max values
  if (entry.beatsPerMinute < dayEntry.min) {
    dayEntry.min = entry.beatsPerMinute;
  }
  if (entry.beatsPerMinute > dayEntry.max) {
    dayEntry.max = entry.beatsPerMinute;
  }

  // Push beats per minute to the array
  dayEntry.beatsPerMinute.push(entry.beatsPerMinute);

  // Update latest data timestamp
  if (entry.timestamps.endTime > dayEntry.latestDataTimestamp) {
    dayEntry.latestDataTimestamp = entry.timestamps.endTime;
  }
}

// Calculate the median and update the output array
for (const entry of output) {
  entry.median = calculateMedian(entry.beatsPerMinute);
  delete entry.beatsPerMinute;
}

// Write the output to a JSON file
fs.writeFileSync('output.json', JSON.stringify(output, null, 2));

console.log('Output file "output.json" has been created successfully.');

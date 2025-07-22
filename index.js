const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// RAM Data (expandable)
const ramDatabase = {
  "kingston fury beast ddr4": {
    name: "Kingston FURY Beast DDR4",
    capacity: "8GB, 16GB, or 32GB",
    type: "DDR4",
    speed: "3200 MHz",
    voltage: "1.35 V",
    compatibility:
      "Requires motherboard with DDR4 DIMM slots (288-pin) supporting 1.35V and 3200 MHz. Check motherboard QVL for compatibility."
  },
  "kingston hyperx fury ddr3": {
    name: "Kingston HyperX FURY DDR3",
    capacity: "8GB",
    type: "DDR3",
    speed: "1600 MHz",
    voltage: "1.5 V",
    compatibility:
      "For older systems only. Requires a DDR3 (240-pin) motherboard. Incompatible with modern DDR4/DDR5 systems."
  },
  "hkc pc ddr4-3200 dimm": {
    name: "HKC PC DDR4-3200 DIMM",
    capacity: "8GB",
    type: "DDR4",
    speed: "3200 MHz",
    voltage: "1.2 V",
    compatibility:
      "Works with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Recommend using matched pairs and checking motherboard QVL."
  },
  "hkcmemory hu40 ddr4 (16gb)": {
    name: "HKCMEMORY HU40 DDR4 (16GB)",
    capacity: "16GB",
    type: "DDR4",
    speed: "3200 MHz",
    voltage: "1.2 V",
    compatibility:
      "Compatible with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Check QVL for higher capacity module compatibility."
  },
  "hkcmemory hu40 ddr4 (8gb)": {
    name: "HKCMEMORY HU40 DDR4 (8GB)",
    capacity: "8GB",
    type: "DDR4",
    speed: "3200 MHz",
    voltage: "1.2 V",
    compatibility:
      "Compatible with DDR4 (288-pin) motherboards supporting 1.2V and 3200 MHz. Matched pairs recommended for dual-channel. Always check motherboard QVL."
  }
};

// Optional: simple GET route to test server is up
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Webhook Route
app.post('/webhook', (req, res) => {
  const intent = req.body.queryResult?.intent?.displayName;
  const parameters = req.body.queryResult?.parameters;

  if (!intent || !parameters) {
    return res.json({ fulfillmentText: 'Invalid request payload.' });
  }

  if (intent === 'Get_RAM_Kingston_FURY_Beast_DDR4_Details') {
    const ramModelRaw = parameters.ram_model;
    if (!ramModelRaw) {
      return res.json({ fulfillmentText: 'Please specify the RAM model.' });
    }

    const ramModel = ramModelRaw.toLowerCase().trim();
    const ram = ramDatabase[ramModel];

    if (ram) {
      const responseText = `The ${ram.name} RAM comes in ${ram.capacity}, is ${ram.type} type, runs at ${ram.speed}, and uses ${ram.voltage}. Compatibility: ${ram.compatibility}`;
      return res.json({ fulfillmentText: responseText });
    } else {
      return res.json({ fulfillmentText: `Sorry, I couldn't find specs for the RAM model "${ramModelRaw}".` });
    }
  } else {
    return res.json({ fulfillmentText: `Intent not handled yet.` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

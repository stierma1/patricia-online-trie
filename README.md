# Patricia Online Server

A lightweight server that maintains a Patricia Trie data structure for fast prefix-based searches. It persists all add/remove operations to a log file to ensure data survival across restarts.

---

## Features
- **Patricia Trie Implementation**: Efficient storage and search for URL tags.
- **Persistent Storage**: Logs all operations to a file, which is replayed on startup to rebuild the trie.
- **API Authentication**: Requires an API key for all requests.
- **Environment Varianble Configuration**: Customize port, API key, and log file location.

---

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Logging Mechanism](#logging-mechanism)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

```bash
git clone https://github.com/stierma1/patricia-online-trie.git
cd patricia-online-trie
npm install
```

---

## Usage

Start the server with optional command-line arguments:

```bash
TRIE_APIKEY=YOUR_KEY TRIE_PORT=PORT TRIE_LOG_FILE=PATH node server.js 
```

Defaults:
- `api_key`: "abc123"
- `port`: 8882
- `log_file`: "./index.log"

---

## Docker Instructions

**Build the Docker Image**:
```bash
docker build -t patricia-trie-server .
```

**Run the Container** (with log file persistence and port mapping):
```bash
#Make sure log file/volume has write permissions on host
docker run -d \
  -p 8882:8882 \
  -v /logs/index.log:/app/index.log \
  -e TRIE_APIKEY=12345 \
  patricia-trie-server
```

## API Endpoints

### 1. **Add a URL to the Trie**
- **Endpoint**: `PUT /add/:tag`
- **Auth**: `apiKey` in query parameter
- **Body**: URL as plain text
- **Response**:
  ```json
  { "success": true, "message": "URL added" }
  ```
- **Example**:
  ```bash
  curl -X PUT \
    -H "Content-Type: text/plain" \
    -d "https://example.com" \
    "http://localhost:8882/add/tag1?apiKey=abc123"
  ```

---

### 2. **Remove a URL from the Trie**
- **Endpoint**: `DELETE /delete/:tag`
- **Auth**: `apiKey` in query parameter
- **Body**: URL as plain text
- **Response**:
  ```json
  { "success": true, "message": "URL removed" }
  ```
- **Example**:
  ```bash
  curl -X DELETE \
    -H "Content-Type: text/plain" \
    -d "https://example.com" \
    "http://localhost:8882/delete/tag1?apiKey=abc123"
  ```

---

### 3. **Search URLs by Tag**
- **Endpoint**: `GET /search/:tag`
- **Auth**: `apiKey` in query parameter
- **Response**: Array of URLs matching the tag
- **Example**:
  ```bash
  curl "http://localhost:8882/search/tag1?apiKey=abc123"
  # Response: ["https://example.com"]
  ```

---

## Configuration

| Env Variable           | Description                          | Default          |
|------------------------|--------------------------------------|------------------|
| `TRIE_APIKEY`          | Secret key for API authentication    | "abc123"         |
| `TRIE_PORT`            | Server port                          | 8882             |
| `TRIE_LOG_FILE`        | Path to the log file                 | "./index.log"    |

---

## Logging Mechanism

- **Persistence**: All `add` and `remove` operations are logged to the specified file.
- **Startup**: The server rebuilds the trie by replaying the log file on startup.
- **Safety Note**: Avoid manually editing the log file to prevent data corruption.

---

## Contributing

Contributions are welcome! Open an issue or submit a pull request.

---

## License

MIT License. See [LICENSE](LICENSE) for details.
```

### Key Notes:
- **Security**: The API key is exposed in the URL (query parameter), which is not ideal for production. Consider using headers or environment variables for sensitive data.
- **Performance**: The log file is critical. Ensure it is stored on a reliable medium and has proper write permissions.
- **Dependencies**: Uses `express` for the server and custom `Startup` class for trie management.

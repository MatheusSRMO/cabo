# Code Runner API Documentation

Welcome to the **Code Runner API** documentation. This API allows you to compile and execute code snippets in multiple programming languages. It provides endpoints to run code and retrieve a list of supported languages. If you encounter any issues or have questions, please contact our support team.

---

## Table of Contents

- [Introduction](#introduction)
- [API Overview](#api-overview)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [POST `/run`](#post-run)
  - [GET `/list`](#get-list)
- [Request and Response Formats](#request-and-response-formats)
  - [POST `/run` Request Body](#post-run-request-body)
  - [POST `/run` Response Body](#post-run-response-body)
  - [GET `/list` Response Body](#get-list-response-body)
- [Examples](#examples)
  - [Running Code](#running-code)
  - [Listing Supported Languages](#listing-supported-languages)
- [Supported Programming Languages](#supported-programming-languages)
- [Error Handling](#error-handling)
- [Conclusion](#conclusion)

---

## Introduction

The Code Runner API enables developers to execute code snippets in various programming languages through a simple HTTP interface. This is useful for online code editors, educational platforms, or any application that requires dynamic code execution.

---

## API Overview

- **Base URL**: `http://cabo.run`
- **Version**: 1.0
- **Content Type**: `application/json`

---

## Authentication

Currently, the API does not require any authentication and is open for public use. Ensure to implement appropriate security measures if deploying this API in a production environment.

---

## Endpoints

### POST `/run`

- **Description**: Compiles and executes a code snippet in the specified programming language.
- **Method**: `POST`
- **Endpoint**: `/run`

### GET `/list`

- **Description**: Retrieves a list of supported programming languages along with their version information.
- **Method**: `GET`
- **Endpoint**: `/list`

---

## Request and Response Formats

### POST `/run` Request Body

- **Content Type**: `application/json`
- **Body Parameters**:

  | Parameter | Type   | Required | Description                                           |
  |-----------|--------|----------|-------------------------------------------------------|
  | language  | String | Yes      | The programming language to execute (e.g., `"python"`). |
  | code      | String | Yes      | The source code to compile and execute.               |
  | input     | String | No       | Optional input data for the code execution.           |

**Example**:

```json
{
  "language": "python",
  "code": "print('Hello, World!')",
  "input": ""
}
```

### POST `/run` Response Body

- **Content Type**: `application/json`
- **Response Parameters**:

  | Parameter     | Type   | Description                                                   |
  |---------------|--------|---------------------------------------------------------------|
  | output        | String | The standard output from the code execution.                  |
  | errors        | String | Any compilation or runtime errors encountered.                |
  | executionTime | String | The time taken to execute the code (e.g., `"0.123s"`).        |
  | status        | String | The status of the execution (`"success"` or `"error"`).       |

**Example (Success)**:

```json
{
  "output": "Hello, World!\n",
  "errors": "",
  "executionTime": "0.05s",
  "status": "success"
}
```

**Example (Error)**:

```json
{
  "output": "",
  "errors": "SyntaxError: invalid syntax",
  "executionTime": "0.01s",
  "status": "error"
}
```

### GET `/list` Response Body

- **Content Type**: `application/json`
- **Response Parameters**:

  An array of objects, each representing a supported language.

  | Parameter | Type   | Description                                  |
  |-----------|--------|----------------------------------------------|
  | language  | String | The programming language name.               |
  | info      | Object | An object containing version and other info. |

**Example**:

```json
[
  {
    "language": "python",
    "info": {
      "version": "3.10.0",
      "extensions": [".py"]
    }
  },
  {
    "language": "javascript",
    "info": {
      "version": "Node.js v16.13.0",
      "extensions": [".js"]
    }
  }
]
```

---

## Examples

### Running Code

**Request**:

```bash
POST http://cabo.run/run
Content-Type: application/json

{
  "language": "python",
  "code": "print('Hello, World!')",
  "input": ""
}
```

**Response**:

```json
{
  "output": "Hello, World!\n",
  "errors": "",
  "executionTime": "0.05s",
  "status": "success"
}
```

**Example Using `curl`**:

```bash
curl -X POST http://cabo.run/run \
  -H "Content-Type: application/json" \
  -d '{"language": "python", "code": "print(\"Hello, World!\")", "input": ""}'
```

### Listing Supported Languages

**Request**:

```bash
GET http://cabo.run/list
```

**Response**:

```json
[
  {
    "language": "python",
    "info": {
      "version": "3.10.0",
      "extensions": [".py"]
    }
  },
  {
    "language": "javascript",
    "info": {
      "version": "Node.js v16.13.0",
      "extensions": [".js"]
    }
  }
  // Additional languages...
]
```

**Example Using `curl`**:

```bash
curl http://cabo.run/list
```

---

## Supported Programming Languages

The API currently supports the following programming languages:

- **Python**
- **JavaScript**
- **Java**
- **C**
- **C++**
- **Go**
- **C#**

To get the most up-to-date list, use the [`GET /list`](#get-list) endpoint.

---

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of an API request.

- **200 OK**: The request was successful.
- **400 Bad Request**: The request was invalid or cannot be served.
- **500 Internal Server Error**: An error occurred on the server.

**Error Response Format**:

```json
{
  "message": "Error description",
  "status": "error"
}
```

**Example**:

```json
{
  "message": "Language not supported",
  "status": "error"
}
```

---

## Conclusion

The Code Runner API provides a simple and efficient way to compile and execute code in various programming languages. Whether you're building an online IDE, an educational tool, or any application that requires dynamic code execution, this API can streamline your development process.

For further assistance, please contact our support team at support@cabo.run.

---

**Note**: Executing code dynamically can pose security risks. Ensure that appropriate sandboxing and security measures are in place when deploying this API.
---

## Important Notes

- **Security**: Be cautious when allowing users to execute arbitrary code. Always implement proper sandboxing and resource limitations to prevent abuse.
- **Rate Limiting**: If deploying this API publicly, consider implementing rate limiting to prevent overuse.
- **Logging and Monitoring**: Keep logs of API usage for monitoring and debugging purposes.

---

## Contact Information

- **Email**: support@cabo.run
- **Website**: [www.cabo.run](http://www.cabo.run)
- **Documentation**: [docs.cabo.run](http://docs.cabo.run)

---

**Thank you for using the Code Runner API!**
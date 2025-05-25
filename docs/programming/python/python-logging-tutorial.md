---
sidebar_position: 4
title: Logging with Decorators in Python
description: A step-by-step tutorial on implementing Python logging with decorators
---

# Logging with Decorators in Python: A Step-by-Step Tutorial

## Introduction

Logging is a critical skill for Python developers working on production applications. This tutorial will guide you through implementing a robust logging system using Python's built-in `logging` module and decorator patterns. By the end, you'll be able to create reusable logging decorators that can be applied across your codebase.

### What You'll Learn
- How to use Python's `logging` module effectively
- How to create and apply logging decorators
- How to configure logging for different environments
- Best practices for handling failures with logs

### Prerequisites
- Basic knowledge of Python
- Understanding of function decorators
- Python 3.6+ installed on your system

## Step 1: Understanding the Basics of Python Logging

The [`logging` module](https://docs.python.org/3/library/logging.html) is part of Python's standard library and provides a flexible framework for emitting log messages. Before diving into decorators, let's understand why professional developers prefer `logging` over simple `print` statements:

- **Log Levels**: Different severity levels (`DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`)
- **Configurability**: Can be configured to output to different destinations (console, files, network)
- **Formatting**: Customizable message formats including timestamps and context information
- **Thread Safety**: Safe for use in multi-threaded applications

## Step 2: Creating a Basic Logging Decorator

Let's start by creating a simple decorator that logs exceptions. This decorator will wrap any function and log errors that occur during execution:

```python
import logging
import functools

def log_error(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logging.error(f"An error occurred in {func.__name__}: {str(e)}")
            raise
    return wrapper

# Example usage
@log_error
def divide(a, b):
    return a / b

try:
    divide(10, 0)
except ZeroDivisionError as e:
    print(f"Caught exception: {e}")
```

**Output (in logs):**
```
ERROR:root:An error occurred in divide: division by zero
```

This logs errors like "division by zero" to help identify issues quickly.

## Step 3: Trying it Yourself

### Step 3.1: Create a new Python file named `basic_logging.py`

Create a new Python file named `basic_logging.py` to test the `log_error` decorator.

### Step 3.2: Copy the decorator code into your file

Copy the `log_error` decorator code into your `basic_logging.py` file.

### Step 3.3: Add a test function that might cause an error

Add a test function that might cause an error, such as the `divide` function shown earlier.

```python
@log_error
def divide(a, b):
    return a / b

try:
    divide(10, 0)
except ZeroDivisionError as e:
    print(f"Caught exception: {e}")
```

### Step 3.4: Run the script and check the output

Run the script and check the output to see the error logged.

**Output (in logs):**
```
ERROR:root:An error occurred in divide: division by zero
```

The error is automatically logged, showing exactly what happened, while still allowing you to handle the exception normally.

## Step 4: Creating an Advanced Logging Decorator

Next, let's create a more sophisticated decorator that:
- Logs function calls with arguments
- Uses named loggers for better organization
- Allows for customization

```python
import logging
import functools

def log(logger=None):
    if logger is None:
        logger = logging.getLogger(__name__)

    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            logger.debug(f"Calling {func.__name__} with args: {args}, kwargs: {kwargs}")
            try:
                result = func(*args, **kwargs)
                return result
            except Exception as e:
                logger.error(f"An error occurred in {func.__name__}: {str(e)}")
                raise
        return wrapper
    return decorator

# Configure a named logger
logger = logging.getLogger('my_module')
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(name)s: %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Example usage
@log(logger=logger)
def multiply(a, b):
    return a * b

multiply(4, 5)

Output (in console):
2025-05-25 06:17:00 [DEBUG] my_module: Calling multiply with args: (4, 5), kwargs: {}

## Step 5: Setting Up Centralized Logging Configuration

As your application grows, you'll want to centralize logging configuration for consistency across modules. In this step, we'll set up a reusable configuration system.

### Step 5.1: Create a configuration file

Create a new file named `logging_config.py` with the following dictionary-based configuration:

```python
import logging.config

LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,  # Important: keeps existing loggers active
    'formatters': {
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        },
        'json': {
            '()': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(asctime)s %(levelname)s %(name)s %(message)s %(pathname)s %(lineno)d'
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'formatter': 'standard',
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stdout'
        },
        'file': {
            'level': 'DEBUG',
            'formatter': 'json',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'application.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5
        },
    },
    'loggers': {
        '': {  # Root logger
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': True
        },
        'my_module': {  # Module-specific logger
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': False  # Won't propagate to root logger
        },
    }
}

logging.config.dictConfig(LOGGING_CONFIG)
```

### Step 5.2: Apply the configuration

Add this code to your `logging_config.py` file to apply the configuration:

```python
def setup_logging():
    logging.config.dictConfig(LOGGING_CONFIG)
    logging.info("Logging configured successfully")

# Call this function at the start of your application
if __name__ == "__main__":
    setup_logging()
```

### Step 5.3: Alternative - File-based configuration

For larger projects, you might prefer to store your configuration in a separate file:

```python
import logging.config

def setup_file_based_logging():
    # Load configuration from a file
    logging.config.fileConfig('logging.conf', disable_existing_loggers=False)
    logging.info("Logging configured from file successfully")
```

This centralized approach ensures consistent logging across all modules in your application.

## Step 6: Troubleshooting with Logs

One of the most valuable aspects of logging is troubleshooting issues in production. Let's walk through the process of using logs to diagnose problems.

### Step 6.1: Locate your log files

When an issue occurs, first locate your log files:

- **For local development**: Check the file specified in your handler (e.g., `application.log`)
- **For production systems**: Access logs via centralized platforms like [ELK Stack](https://www.elastic.co/what-is/elk-stack) or [Splunk](https://www.splunk.com/)

### Step 6.2: Filter logs to find errors

Use these techniques to identify issues:

- Filter for `ERROR` or `CRITICAL` level messages to find serious problems
- Use timestamps to trace the sequence of events leading to the failure
- Examine stack traces for detailed exception information

### Step 6.3: Analyze the problem

Once you've identified error messages:

- Use logged function calls and arguments to reproduce the issue
- Look for patterns or recurring errors that might indicate systemic problems
- Use structured logs (JSON format) to programmatically analyze trends

### Step 6.4: Set up real-time monitoring

For critical applications, implement real-time log monitoring:

- Configure tools like ELK Stack, Splunk, or [SigNoz](https://signoz.io/) for live monitoring
- Set up alerts for critical log levels to receive immediate notifications

### Step 6.5: Practice with a simulated error

Let's practice troubleshooting by analyzing logs from a division by zero error:

```
2025-05-25 06:17:00 [DEBUG] my_module: Calling divide with args: (10, 0), kwargs: {}
2025-05-25 06:17:00 [ERROR] my_module: An error occurred in divide: division by zero
```

From these logs, we can identify:
- The function that failed (`divide`)
- The problematic input values (`10` and `0`)
- The exact error (`division by zero`)
- The time when it occurred

This information allows you to quickly identify and fix the issue (in this case, adding validation to prevent division by zero).

## Step 7: Adding Context to Your Logs

To make logs more useful, you can add additional context information. In this step, we'll create a decorator that adds contextual data to each log message.

### Step 7.1: Create a contextual logging decorator

Create a new file named `contextual_logging.py` with this decorator that adds context to log messages:

```python
import logging
import functools

def log_with_context(logger=None):
    if logger is None:
        logger = logging.getLogger(__name__)
        
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Add context to all log messages from this function
            context = {
                'function': func.__name__,
                'module': func.__module__,
                'user_id': kwargs.get('user_id', 'anonymous')
            }
            
            # Create a logger adapter with extra context
            adapter = logging.LoggerAdapter(logger, context)
            
            try:
                result = func(*args, **kwargs)
                adapter.info(f"Function executed successfully")
                return result
            except Exception as e:
                adapter.error(f"Function failed: {str(e)}", exc_info=True)
                raise
        return wrapper
    return decorator
```

### Step 7.2: Try out contextual logging

Test the decorator with a simple function that uses the context:

```python
# Configure the logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: [%(function)s] [User: %(user_id)s] %(message)s'
)

# Apply the decorator
@log_with_context()
def process_user_data(data, user_id="unknown"):
    # Some processing
    return data

# Call the function
process_user_data({"name": "John"}, user_id="user123")
```

You'll see output like:
```
2025-05-25 06:30:00 [INFO] __main__: [process_user_data] [User: user123] Function executed successfully
```

## Step 8: Handling Thread Safety in Logging

When working with multi-threaded applications, you need to ensure your logging is thread-safe.

### Step 8.1: Use thread-local storage for request-specific data

Create a file named `thread_safe_logging.py`:

```python
import logging
import threading

# Thread-local storage for request-specific data
thread_local = threading.local()

class RequestContextFilter(logging.Filter):
    """Add request-specific information to log records."""
    
    def filter(self, record):
        if hasattr(thread_local, 'request_id'):
            record.request_id = thread_local.request_id
        else:
            record.request_id = 'no-request-id'
        return True
```

### Step 8.2: Configure your logger with the filter

```python
# Setup logging with the filter
logger = logging.getLogger('app')
logger.setLevel(logging.INFO)

# Add the custom filter
request_filter = RequestContextFilter()
logger.addFilter(request_filter)

# Add a handler
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s [%(levelname)s] [%(request_id)s] %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
```

### Step 8.3: Use in a multi-threaded context

```python
def process_request(request_number):
    # Set request ID in thread-local storage
    thread_local.request_id = f"req-{request_number}"
    
    logger.info(f"Processing request {request_number}")
    # Processing logic here
    logger.info(f"Completed request {request_number}")

# Create threads to simulate concurrent requests
import concurrent.futures

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    executor.map(process_request, range(5))
```

## Step 9: Implementing Best Practices

Let's create a checklist of best practices to follow in your logging implementation:

### Step 9.1: Use named loggers

```python
# Instead of using the root logger
logging.info("Message")  # Not recommended for larger applications

# Use a named logger specific to the module
logger = logging.getLogger(__name__)  # Best practice
logger.info("Message")
```

### Step 9.2: Set appropriate log levels

```python
# Development environment
logger.setLevel(logging.DEBUG)  # Capture detailed diagnostic information

# Production environment
logger.setLevel(logging.INFO)  # Only capture significant events
```

### Step 9.3: Protect sensitive data

```python
# WRONG - exposing sensitive information
logger.info(f"User authenticated with password: {password}")  

# RIGHT - logging the event without exposing secrets
logger.info(f"User {username} authenticated successfully")
```

### Step 9.4: Implement log rotation

```python
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler(
    'application.log',
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5            # Keep 5 backup files
)
logger.addHandler(handler)
```

## Step 10: Integration with Web Frameworks

Logging becomes even more powerful when integrated with web frameworks.

### Step 10.1: Flask integration

Create a file named `flask_logging_example.py`:

```python
from flask import Flask, request, g
import logging
import uuid
import functools

app = Flask(__name__)

# Setup logging
logger = logging.getLogger('flask_app')
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s [%(levelname)s] [%(request_id)s] %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Create a logging decorator
def log_route(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        logger.info(f"Route {request.path} called")
        return f(*args, **kwargs)
    return decorated_function

# Add request ID middleware
@app.before_request
def before_request():
    g.request_id = request.headers.get('X-Request-ID', str(uuid.uuid4()))
    # Make request ID available to logger
    logger.filter(lambda record: setattr(record, 'request_id', g.request_id) or True)

# Apply decorator to routes
@app.route('/')
@log_route
def index():
    logger.info("Processing index request")
    return "Hello World"

if __name__ == '__main__':
    app.run(debug=True)
```

### Step 10.2: Django integration

For Django applications, create a file named `django_logging_middleware.py`:

```python
# middleware.py
import logging
import uuid

logger = logging.getLogger('django_app')

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Generate or extract request ID
        request_id = request.headers.get('X-Request-ID', str(uuid.uuid4()))
        request.request_id = request_id
        
        # Log the request
        logger.info(f"Request {request.method} {request.path}", 
                   extra={'request_id': request_id})
        
        # Process the request
        response = self.get_response(request)
        
        # Add request ID to response
        response['X-Request-ID'] = request_id
        
        # Log the response
        logger.info(f"Response status: {response.status_code}",
                   extra={'request_id': request_id})
        
        return response
```

## References

- [Python Logging Official Documentation](https://docs.python.org/3/library/logging.html)
- [Structured Logging with Python](https://www.honeybadger.io/blog/python-structured-logging/)
- [Python Logging Best Practices](https://machinelearningmastery.com/logging-in-python/)
- [OpenTelemetry for Python](https://opentelemetry.io/docs/instrumentation/python/)

```python
import logging
import functools

def log_error(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            logging.error(f"An error occurred in {func.__name__}: {str(e)}")
            raise
    return wrapper

@log_error
def divide(a, b):
    return a / b

try:
    divide(10, 0)
except ZeroDivisionError as e:
    print(f"Caught exception: {e}")
```

Output (in logs):
ERROR:root:An error occurred in divide: division by zero

This uses functools.wraps to preserve function metadata and logs exceptions at the ERROR level.
Implementation: Advanced Logging Decorator
For comprehensive logging, this decorator logs function arguments and uses a named logger:

```python
import logging
import functools

def log(logger=None):
    if logger is None:
        logger = logging.getLogger(__name__)

    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            logger.debug(f"Calling {func.__name__} with args: {args}, kwargs: {kwargs}")
            try:
                result = func(*args, **kwargs)
                return result
            except Exception as e:
                logger.error(f"An error occurred in {func.__name__}: {str(e)}")
                raise
        return wrapper
    return decorator
```

### Step 4.1: Configure a named logger

Unlike our basic example that used the root logger, it's better practice to use named loggers. Create a named logger and configure it:

```python
# Create a file named advanced_logging.py
import logging
import functools

# First define the decorator (code above)

# Then configure a named logger
logger = logging.getLogger('my_module')
logger.setLevel(logging.DEBUG)  # Set the minimum level to capture
handler = logging.StreamHandler()  # Output to console
formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(name)s: %(message)s')  # Format with timestamp
handler.setFormatter(formatter)
logger.addHandler(handler)
```

### Step 4.2: Apply the decorator to a function

Now apply the decorator to a function and test it:

```python
@log(logger=logger)  # Pass our configured logger to the decorator
def multiply(a, b):
    return a * b

result = multiply(4, 5)
print(f"Result: {result}")
```

### Step 4.3: Run and check the output

When you run this code, you'll see detailed logging information:

**Output (in console):**
```
2025-05-25 06:17:00 [DEBUG] my_module: Calling multiply with args: (4, 5), kwargs: {}
Result: 20
```

This advanced decorator logs both function calls with their arguments (at DEBUG level) and any exceptions (at ERROR level), providing more context for debugging.

## Configuring Logging for Scalability
Centralized configuration ensures consistency. Below is an example using logging.config.dictConfig:

```python
import logging.config

LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        },
        'json': {
            '()': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(asctime)s %(levelname)s %(name)s %(message)s'
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'formatter': 'standard',
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stdout'
        },
        'file': {
            'level': 'DEBUG',
            'formatter': 'json',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'application.log',
            'maxBytes': 10485760,  # 10MB
            'backupCount': 5
        },
    },
    'loggers': {
        '': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
            'propagate': True
        },
        'my_module': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': False
        },
    }
}
```

```python
logging.config.dictConfig(LOGGING_CONFIG)
```
This configuration includes:

- A console handler for INFO-level logs.
- A file handler with JSON formatting using pythonjsonlogger.jsonlogger.JsonFormatter and log rotation (10MB per file, 5 backups).
- A named logger (my_module) for module-specific logging.

## Handling Failures with Logs
When a failure occurs, logs are critical for diagnosis. Here’s how to use them effectively:

### 1. Locate Log Files

- For FileHandler, check the specified file (e.g., application.log).
- In production, access logs via centralized platforms like ELK Stack or Splunk.

### 2. Read and Interpret Logs

- Filter for ERROR or CRITICAL messages to identify failures.
- Use timestamps to sequence events leading to the issue.
- Review stack traces for detailed exception information.

### 3. Debugging with Logs

- Use logged function calls and arguments to reproduce the failure.
- Identify patterns or recurring errors indicating systemic issues.
- Parse structured logs (e.g., JSON) to analyze trends programmatically.

### 4. Real-Time Log Monitoring

- Use tools like ELK Stack, Splunk, or SigNoz for live monitoring.
- Configure alerts for critical log levels to receive immediate notifications.

### Example: Debugging a Failure
Consider a ZeroDivisionError. The log might show:

```python
2025-05-25 06:17:00 [DEBUG] my_module: Calling divide with args: (10, 0), kwargs: {}
2025-05-25 06:17:00 [ERROR] my_module: An error occurred in divide: division by zero
```

This indicates `divide(10, 0)` caused the error, enabling quick identification and resolution.

## Best Practices Summary

The following table summarizes best practices for logging in applications:

| Practice | Description | Example/Code |
|----------|-------------|---------------|
| Use Named Loggers | Organize logs by module for granularity | `logger = logging.getLogger(__name__)` |
| Set Optimal Logging Levels | Use DEBUG for development, INFO or higher for production | `logger.setLevel(logging.INFO)` |
| Structured Logging | Use JSON for machine-readable logs | `logger.info("Event", extra={"event_name": "purchase"})` |
| Avoid Sensitive Data | Mask or omit PII and secrets | `logger.debug(f"User: {mask_pii(user_id)}")` |
| Log Rotation | Prevent disk space issues with RotatingFileHandler | `RotatingFileHandler('app.log', maxBytes=10*1024*1024, backupCount=5)` |
| Centralized Logging | Aggregate logs using ELK, Splunk, or cloud services | Use `logging.handlers.HTTPHandler` for centralized systems |
| Monitor Logs | Set up alerts for critical issues | Integrate with tools like SigNoz or Datadog |
| Performance Optimization | Avoid excessive logging in critical paths | Check log level before expensive operations |
| Consistent Third-Party Logging | Align log levels with external libraries | Configure library loggers in `LOGGING_CONFIG` |
| Log Health Checks | Verify logs are generated and accessible | Periodic checks for missing logs or disk usage |


## Advanced Considerations

### Custom Handlers
Use custom handlers, such as `HTTPHandler`, to send logs to internal monitoring systems for real-time analysis:

```python
from logging.handlers import HTTPHandler
import json

class JsonHTTPHandler(HTTPHandler):
    """Custom handler to send JSON-formatted logs to a monitoring service"""
    
    def mapLogRecord(self, record):
        # Convert log record to JSON format
        record_dict = record.__dict__.copy()
        return json.dumps(record_dict)
        
# Add to your configuration
handler = JsonHTTPHandler(host='monitoring.example.com:443', 
                          url='/api/logs', 
                          method='POST',
                          secure=True)
```

### Class Methods
Decorators can be adapted for class methods by handling `self` appropriately:

```python
def method_logger(logger=None):
    if logger is None:
        logger = logging.getLogger(__name__)
        
    def decorator(method):
        @functools.wraps(method)
        def wrapper(self, *args, **kwargs):
            class_name = self.__class__.__name__
            logger.debug(f"{class_name}.{method.__name__} called with {args}, {kwargs}")
            try:
                result = method(self, *args, **kwargs)
                return result
            except Exception as e:
                logger.error(f"Error in {class_name}.{method.__name__}: {e}", exc_info=True)
                raise
        return wrapper
    return decorator
```

### Asynchronous Logging
For performance-critical applications, `QueueHandler` enables asynchronous logging to avoid blocking the main thread:

```python
import logging
import queue
import threading
from logging.handlers import QueueHandler, QueueListener

# Create queue and handlers
log_queue = queue.Queue(-1)  # No limit on size
queue_handler = QueueHandler(log_queue)

# Configure root logger with queue handler
root = logging.getLogger()
root.addHandler(queue_handler)
root.setLevel(logging.DEBUG)

# Regular handlers that will process records from the queue
file_handler = logging.FileHandler("app.log")
file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s'))

# Set up listener
listener = QueueListener(log_queue, file_handler)
listener.start()

# To stop the listener when the application exits
# listener.stop()
```

## Conclusion
Using decorator functions for logging in Python aligns with enterprise-level requirements for scalable systems. By implementing decorators that log function calls, arguments, and exceptions, and combining them with named loggers, structured formats, and centralized configurations, developers can achieve robust observability. 

This approach provides several benefits:

1. **Clean separation of concerns** - Business logic remains uncluttered by logging code
2. **Consistency across the codebase** - Uniform logging format and level usage
3. **Centralized configuration** - Easy adjustment of logging behavior application-wide
4. **Enhanced debugging capabilities** - Detailed context for troubleshooting issues

Handling failures with logs ensures quick diagnosis and resolution, making this approach ideal for large-scale applications.

## Summary
This tutorial has covered the key aspects of Python logging with decorators, including:

*   Creating a logging decorator to log function calls and exceptions
*   Configuring logging for scalability using `logging.config.dictConfig`
*   Handling failures with logs for effective debugging
*   Best practices for logging in applications
*   Advanced considerations, such as custom handlers, class methods, and asynchronous logging

By following this tutorial, you've gained the knowledge to implement professional-grade logging in your Python applications using decorators.

## References

*   [Python Official Documentation: Logging](https://docs.python.org/3/library/logging.html)
*   [Python Logging Cookbook](https://docs.python.org/3/howto/logging-cookbook.html)
*   [Python Logging Best Practices by Last9](https://last9.io/blog/python-logging-best-practices/)
*   [Best Practices for Logging in Python by Better Stack](https://betterstack.com/community/guides/logging/python/)
*   [Python Logging Best Practices by SigNoz](https://signoz.io/blog/python-logging-best-practices/)
*   [Python Logging Best Practices by Middleware](https://middleware.io/blog/python-logging-best-practices/)
*   [Create an Exception Logging Decorator by GeeksforGeeks](https://www.geeksforgeeks.org/create-an-exception-logging-decorator-in-python/)
*   [Python Logging with Datadog](https://docs.datadoghq.com/logs/log_collection/python/)
*   [Structured Logging in Python](https://www.loggly.com/use-cases/json-logging-in-python/)
*   [Logging at Scale by Loggly](https://www.loggly.com/blog/logging-in-the-cloud-at-scale/)
*   [Advanced Python Logging by Uptrace](https://uptrace.dev/opentelemetry/python-logging.html)
*   [ELK Stack Overview by Elastic](https://www.elastic.co/what-is/elk-stack)
*   [Splunk Platform Overview](https://www.splunk.com/en_us/platform.html)
*   [SigNoz Open-Source Observability](https://signoz.io/)
*   [OpenTelemetry for Python](https://opentelemetry.io/docs/instrumentation/python/)
---
sidebar_position: 4
title: Logging with Decorators in Python
description: A deep dive into Python's logging with decorators with real-world examples
---

# Logging with Decorators in Python

## Key Points
- Professional Python programmers use the built-in `logging` module for its flexibility and robustness.
- Decorators are employed to standardize logging, capturing function calls, arguments, and exceptions consistently.
- When failures occur, logs are critical for identifying issues, with `ERROR` and `CRITICAL` messages providing key insights.
- Logs are typically accessed via local files or centralized systems like [ELK Stack](https://www.elastic.co/what-is/elk-stack) or [Splunk](https://www.splunk.com/).
- Structured logging and real-time monitoring with tools like [SigNoz](https://signoz.io/) are used for efficient debugging.

## Overview
Logging is critical for debugging, monitoring, and maintaining large-scale Python applications. Python's [`logging` module](https://docs.python.org/3/library/logging.html) provides a robust framework, and decorators simplify logging by automatically tracking function calls, arguments, and errors. This ensures logs are consistent, structured, and manageable, even in complex, distributed systems.

## Why Use Decorators?
Decorators wrap functions to add logging without cluttering their core logic. They can log when a function runs, what inputs it receives, and any errors it encounters. This is especially useful in large codebases.

## Basic Logging Decorator
A simple decorator can log errors to help with debugging. Below is an example that logs exceptions:

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

## Advanced Logging Decorator
For more detailed logging, decorators can track function arguments and use named loggers for better organization:

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

## Configuring Logging
Centralized logging configuration ensures consistency across large applications. Below is an example using a dictionary configuration:

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

You can also configure logging using a file:

```python
import logging.config

# Load configuration from a file
logging.config.fileConfig('logging.conf', disable_existing_loggers=False)
```

This setup directs logs to the console and a file, with JSON formatting and log rotation for scalability.

## Handling Failures with Logs
When a failure occurs, logs are critical for diagnosis. Here's how to use them effectively:

### 1. Locate Log Files
- For FileHandler, check the specified file (e.g., `application.log`)
- In production, access logs via centralized platforms like [ELK Stack](https://www.elastic.co/what-is/elk-stack) or [Splunk](https://www.splunk.com/)

### 2. Read and Interpret Logs
- Filter for `ERROR` or `CRITICAL` messages to identify failures
- Use timestamps to sequence events leading to the issue
- Review stack traces for detailed exception information

### 3. Debugging with Logs
- Use logged function calls and arguments to reproduce the failure
- Identify patterns or recurring errors indicating systemic issues
- Parse structured logs (e.g., JSON) to analyze trends programmatically

### 4. Real-Time Log Monitoring
- Use tools like ELK Stack, Splunk, or [SigNoz](https://signoz.io/) for live monitoring
- Configure alerts for critical log levels to receive immediate notifications

### Example: Debugging a Failure
Consider a ZeroDivisionError. The log might show:

```
2025-05-25 06:17:00 [DEBUG] my_module: Calling divide with args: (10, 0), kwargs: {}
2025-05-25 06:17:00 [ERROR] my_module: An error occurred in divide: division by zero
```

This indicates `divide(10, 0)` caused the error, enabling quick identification and resolution.

## Contextual Logging

Adding context to logs can provide valuable information without cluttering your code. Python's logging module supports this with the `extra` parameter:

```python
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

## Thread Safety in Logging

Python's logging module is thread-safe, but you should be aware of certain considerations when working with multi-threaded applications:

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

# Add the filter to your logger
logger = logging.getLogger('app')
logger.addFilter(RequestContextFilter())
```

## Best Practices

- **Use Named Loggers**: Organize logs by module for better tracking (`logging.getLogger(__name__)`).
- **Set Appropriate Levels**: Use `DEBUG` for development, `INFO` or higher for production.
- **Avoid Sensitive Data**: Never log passwords, API keys, or personal information.
  ```python
  # WRONG
  logger.info(f"User authenticated with password: {password}")
  
  # RIGHT
  logger.info(f"User {username} authenticated successfully")
  ```
- **Use Log Rotation**: Manage file sizes with `RotatingFileHandler` or `TimedRotatingFileHandler`.
- **Centralize Logs**: Aggregate logs using tools like ELK Stack or SigNoz for distributed systems.
- **Use Structured Logging**: JSON format enables better searching and analysis.
- **Include Correlation IDs**: Add request IDs to trace requests across microservices.

## Integration with Web Frameworks

### Flask Example

```python
from flask import Flask, request, g
import logging
import uuid

app = Flask(__name__)

@app.before_request
def before_request():
    g.request_id = request.headers.get('X-Request-ID', str(uuid.uuid4()))

@log()
def some_view_function():
    # This function will be logged with the request ID context
    return "Response"
```

### Django Example

```python
# middleware.py
import uuid

class RequestIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request_id = request.headers.get('X-Request-ID', str(uuid.uuid4()))
        request.request_id = request_id
        response = self.get_response(request)
        response['X-Request-ID'] = request_id
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

### Configure a named logger

```python
logger = logging.getLogger('my_module')
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(name)s: %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
```

### Example usage

```python
@log(logger=logger)
def multiply(a, b):
    return a * b
multiply(4, 5)
```

**Output (in console):**
```
2025-05-25 06:17:00 [DEBUG] my_module: Calling multiply with args: (4, 5), kwargs: {}
```

This logs function calls at the DEBUG level and exceptions at the ERROR level, using a named logger.

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

## References

- [Python Official Documentation: Logging](https://docs.python.org/3/library/logging.html)
- [Python Logging Cookbook](https://docs.python.org/3/howto/logging-cookbook.html)
- [Python Logging Best Practices by Last9](https://last9.io/blog/python-logging-best-practices/)
- [10 Best Practices for Logging in Python by Better Stack](https://betterstack.com/community/articles/10-best-practices-for-logging-in-python/)
- [Python Logging Best Practices by SigNoz](https://signoz.io/blog/python-logging-best-practices/)
- [12 Python Logging Best Practices by Middleware](https://middleware.io/blog/12-python-logging-best-practices/)
- [A Better Way to Logging in Python by Ankitbko](https://ankitbko.github.io/blog/2014/07/15/better-logging-in-python/)
- [Create an Exception Logging Decorator by GeeksforGeeks](https://www.geeksforgeeks.org/create-an-exception-logging-decorator-in-python/)
- [Python Logging Formats by Datadog](https://docs.datadoghq.com/logs/log_collection/python/?tab=logging)
- [Best Practices for Logging in Python by Loggly](https://loggly.com/blog/best-practices-for-logging-in-python/)
- [Best Practices for Logging at Scale by Loggly](https://loggly.com/blog/best-practices-for-logging-at-scale/)
- [Advanced Python Logging by Uptrace](https://uptrace.dev/opentelemetry/logs/python-logging.html)
- [ELK Stack Overview by Elastic](https://www.elastic.co/what-is/elk-stack)
- [Splunk Platform Overview](https://www.splunk.com/en_us/solutions/splunk-platform.html)
- [SigNoz Open-Source Observability](https://signoz.io/)
- [OpenTelemetry for Python](https://opentelemetry.io/docs/instrumentation/python/)
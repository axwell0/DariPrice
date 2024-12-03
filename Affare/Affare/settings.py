# Scrapy settings for Affare project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     https://docs.scrapy.org/en/latest/topics/settings.html
#     https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://docs.scrapy.org/en/latest/topics/spider-middleware.html
from datetime import datetime
import logging
import os

BOT_NAME = "Affare"

SPIDER_MODULES = ["Affare.spiders"]
NEWSPIDER_MODULE = "Affare.spiders"


# Obey robots.txt rules
ROBOTSTXT_OBEY = True



# Configure maximum concurrent requests performed by Scrapy (default: 16)
CONCURRENT_REQUESTS = 16

# Configure a delay for requests for the same website (default: 0)
# See https://docs.scrapy.org/en/latest/topics/settings.html#download-delay
# See also autothrottle settings and docs
#DOWNLOAD_DELAY = 3
# The download delay setting will honor only one of:
CONCURRENT_REQUESTS_PER_DOMAIN = 8

#CONCURRENT_REQUESTS_PER_IP = 16

# Disable cookies (enabled by default)
#COOKIES_ENABLED = False

# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False

# Override the default request headers:
#DEFAULT_REQUEST_HEADERS = {
#    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
#    "Accept-Language": "en",
#}

# Enable or disable spider middlewares
# See https://docs.scrapy.org/en/latest/topics/spider-middleware.html
SPIDER_MIDDLEWARES = {
    "Affare.middlewares.AffareSpiderMiddleware": 543,
}
TELNETCONSOLE_ENABLED = False


# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
DOWNLOADER_MIDDLEWARES = {
    "Affare.middlewares.MongoDBDeduplicationMiddleware": 543,
    'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware': 810,
}

RETRY_ENABLED = True
RETRY_TIMES = 3  # Number of retries before giving up
AUTOTHROTTLE_ENABLED = True
AUTOTHROTTLE_START_DELAY =0  # Initial download delay
AUTOTHROTTLE_MAX_DELAY = 10  # Max delay (in seconds) in case of high latencies
AUTOTHROTTLE_TARGET_CONCURRENCY = 8  # Adjusts requests per domain based on server load

FEED_EXPORT_ENCODING = 'utf-8'
# Enable or disable extensions
# See https://docs.scrapy.org/en/latest/topics/extensions.html
#EXTENSIONS = {
#    "scrapy.extensions.telnet.TelnetConsole": None,
#}

# Configure item pipelines
# See https://docs.scrapy.org/en/latest/topics/item-pipeline.html
ITEM_PIPELINES = {

    "Affare.pipelines.JSONExport": 300,
    "Affare.pipelines.MongoPipeline": 400,

}

MONGO_URI = "mongodb+srv://messaimahdi:Mm0CRXqmbNuFWKqo@cluster0.9c5ur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
MONGO_DATABASE = 'Houses'

# Enable and configure the AutoThrottle extension (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/autothrottle.html
#AUTOTHROTTLE_ENABLED = True
# The initial download delay
#AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
#AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server





LOG_DIR = 'logs'
os.makedirs(LOG_DIR, exist_ok=True)
log_file = os.path.join(LOG_DIR, f"log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
LOG_LEVEL = logging.INFO

logger = logging.getLogger()
logger.setLevel(LOG_LEVEL)

if logger.hasHandlers():
    logger.handlers.clear()

file_handler = logging.FileHandler(log_file)
file_handler.setLevel(LOG_LEVEL)

stream_handler = logging.StreamHandler()
stream_handler.setLevel(LOG_LEVEL)

formatter = logging.Formatter('%(asctime)s [%(name)s] %(levelname)s: %(message)s')
file_handler.setFormatter(formatter)

logger.addHandler(file_handler)
logger.addHandler(stream_handler)

LOG_STDOUT = False

# Disable pymongo logs
# logging.getLogger("pymongo").setLevel(logging.CRITICAL)
# Enable showing throttling stats for every response received:
#AUTOTHROTTLE_DEBUG = False

# Enable and configure HTTP caching (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = "httpcache"
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = "scrapy.extensions.httpcache.FilesystemCacheStorage"

# Set settings whose default value is deprecated to a future-proof value
REQUEST_FINGERPRINTER_IMPLEMENTATION = "2.7"
TWISTED_REACTOR = "twisted.internet.asyncioreactor.AsyncioSelectorReactor"
CLIENT_SECRET = "NNmzxg3DNm4EX4XEEh3uB22g2g2jfd3xx3uWoz1x"

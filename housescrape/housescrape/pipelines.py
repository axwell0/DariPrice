# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html
import datetime
import logging
import os
import pymongo
import scrapy
import json
from itemadapter import ItemAdapter


class MongoPipeline:
    def __init__(self, mongo_uri, mongo_db):
        self.client = pymongo.MongoClient(mongo_uri)
        self.db = self.client[mongo_db]
        self.logger = logging.getLogger(__name__)

    @classmethod
    def from_crawler(cls, crawler):
        mongo_uri = crawler.settings.get("MONGO_URI")

        return cls(
            mongo_uri=mongo_uri,
            mongo_db=crawler.settings.get("MONGO_DATABASE"),
        )

    def open_spider(self, spider: scrapy.Spider):
        if not (spider.name in self.db.list_collection_names()):
            self.db.create_collection(spider.name)

        indexes = self.db[spider.name].index_information()
        if not ("url" in indexes.keys()):
            print(f"Creating unique index 'url'...")
            self.db[spider.name].create_index({"url": pymongo.ASCENDING}, unique=True)

    def close_spider(self, spider: scrapy.Spider):
        self.client.close()

    def process_item(self, item, spider):
        item_dict = ItemAdapter(item).asdict()
        try:
            self.db[spider.name].insert_one(item_dict)
            self.logger.info(f'Inserted {item_dict["url"]} successfully!')
            return item
        except Exception as e:
            self.logger.error(f'Failed to insert {item_dict["url"]}: {e}')

class JSONExport:

    def __init__(self):
        self.file = None

    def open_spider(self, spider: scrapy.Spider):
        data_dir = "data"
        if not os.path.exists(data_dir):
            os.makedirs(data_dir)
        self.file = open(f"{data_dir}/{spider.name}_{datetime.datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.jsonl", "w",
                         encoding='utf-8')
        self.file.write('[\n')

    def close_spider(self, spider):
        self.file.write('\n]')
        self.file.close()

    def process_item(self, item, spider):
        line = json.dumps(
            ItemAdapter(item).asdict(),
            ensure_ascii=False,
            default=str
        ) + "\n"
        self.file.write(line + ',\n')
        return item

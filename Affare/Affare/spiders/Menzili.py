import re

import scrapy
from ..items import MenziliItem


class MenziliSpider(scrapy.Spider):
    name = 'menzili'
    start_urls = ['https://www.menzili.tn/immo/vente-maison-tunisie?l=0&page=1&tri=1',"https://www.menzili.tn/immo/vente-appartement-neuf-tunisie?l=0&page=1&tri=1"]


    def start_requests(self):
        for url in MenziliSpider.start_urls:
            yield scrapy.Request(url, self.parse, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'})

    def parse_posting(self, response):
        posting = MenziliItem()
        posting["url"] = response.url
        posting['Type'] = response.meta.get('Type')
        self.logger.info(f'{self.name}: Scraping {response.url}...')
        posting["title"] = response.css("h1[itemprop='name']::text").get()
        posting["location"] = response.css("div.col-md-8.col-xs-12.col-sm-7.product-title-h1 p::text").get().strip()
        if response.css("div.product-price p::text").get():
            posting["price"] = response.css("div.product-price p::text").get().strip()

        posting["description"] = ' '.join(
            [item.strip() for item in response.css("div.block-descr p[itemprop='text']::text").getall()])
        for k, v in zip([re.sub(r'[^\w\s]', '', item).strip() for item in response.css(
                "div.block-detail div.col-md-5.col-xs-12.col-sm-5.block-over > span::text").getall()],
                        [item.strip() for item in response.css(
                                "div.block-detail div.col-md-5.col-xs-12.col-sm-5.block-over > strong::text").getall()]):
            posting[k] = v
        posting["misc"] = [item.strip() for item in
                           response.css("div.col-md-12.col-xs-12.col-sm-12.block-over span strong::text").getall() if
                           item.strip()]
        yield posting

    def parse(self, response):
        next_page = response.xpath(
            '//li[a[@class="pag-item btn btn-default pag-activated"]]/following-sibling::li[1]/a/@href').get()
        if next_page:

            for posting_link in response.css("a.li-item-list-title::attr(href)").getall():
                if 'appartement' in response.url:
                    meta = {'Type': 'appartement'}
                else:
                    meta = {'Type': 'villa'}
                yield response.follow(posting_link, self.parse_posting,meta=meta,headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'})

            yield scrapy.Request(
                next_page,
                self.parse,headers={
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'})
